'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Chat = {
  id: string;
  title: string;
};

// Stable timestamp for default message so server and client render the same (avoids hydration mismatch)
const DEFAULT_MESSAGE_TIMESTAMP = new Date('2000-01-01T12:00:00');

const DEFAULT_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content: 'Hi! This is a dummy chat. Type a message and press Enter or click Send.',
    timestamp: DEFAULT_MESSAGE_TIMESTAMP,
  },
];

const RESPONSE_DELAY_MS = 1800;
const TYPING_START_DELAY_MS = 500; // delay before typing indicator appears

function getChatTitle(messages: Message[]): string {
  const firstUser = messages.find((m) => m.role === 'user');
  if (firstUser) {
    const text = firstUser.content.slice(0, 28);
    return text.length < firstUser.content.length ? `${text}…` : text;
  }
  return 'New chat';
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (toDateKey(today) === dateKey) return 'Today';
  if (toDateKey(yesterday) === dateKey) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function groupMessagesByDay(messages: Message[]): { dateKey: string; messages: Message[] }[] {
  const byDay = new Map<string, Message[]>();
  for (const m of messages) {
    const key = toDateKey(m.timestamp);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(m);
  }
  return Array.from(byDay.entries()).map(([dateKey, msgs]) => ({ dateKey, messages: msgs }));
}

// --- Message context menu (hover actions) ---
function MessageActions({
  message,
  onEdit,
  onDelete,
  onForward,
  onQuote,
}: {
  message: Message;
  onEdit: () => void;
  onDelete: () => void;
  onForward: () => void;
  onQuote: () => void;
}) {
  const isUser = message.role === 'user';
  return (
    <div
      className="flex gap-0.5 rounded-lg border border-zinc-200 bg-white px-1 py-1 shadow-md dark:border-zinc-700 dark:bg-zinc-800"
      role="toolbar"
      aria-label="Message actions"
    >
      {isUser && (
        <>
          <button
            type="button"
            onClick={onEdit}
            className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
            title="Edit"
            aria-label="Edit message"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            title="Delete"
            aria-label="Delete message"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </>
      )}
      <button
        type="button"
        onClick={onForward}
        className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
        title="Forward"
        aria-label="Forward message"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onQuote}
        className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
        title="Quote"
        aria-label="Quote message"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20V4c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v8z" />
        </svg>
      </button>
    </div>
  );
}

// --- Typing indicator ---
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-start"
    >
      <div className="flex max-w-[85%] items-center gap-1 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([{ id: '1', title: 'General' }]);
  const [activeChatId, setActiveChatId] = useState<string>('1');
  const [messagesByChatId, setMessagesByChatId] = useState<Record<string, Message[]>>({
    '1': DEFAULT_MESSAGES,
  });
  const [input, setInput] = useState('');
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [mobileChatDropdownOpen, setMobileChatDropdownOpen] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [forwardToast, setForwardToast] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevMessageCountRef = useRef(0);
  const detailsPopoverRef = useRef<HTMLDivElement>(null);
  const contextBarRef = useRef<HTMLDivElement>(null);
  const responseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = messagesByChatId[activeChatId] ?? [];
  const activeChat = chats.find((c) => c.id === activeChatId);

  // When switching chats, sync the count so we don't scroll on first render
  useEffect(() => {
    prevMessageCountRef.current = messages.length;
  }, [activeChatId]);

  // When a new message is added (e.g. we sent one or got a reply), scroll to bottom so we see the latest
  useEffect(() => {
    const el = listRef.current;
    if (!el || messages.length === 0) return;
    if (messages.length > prevMessageCountRef.current) {
      prevMessageCountRef.current = messages.length;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Close mobile dropdowns when clicking outside
  useEffect(() => {
    if (!mobileDetailsOpen && !mobileChatDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (contextBarRef.current?.contains(target) || detailsPopoverRef.current?.contains(target)) return;
      setMobileDetailsOpen(false);
      setMobileChatDropdownOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [mobileDetailsOpen, mobileChatDropdownOpen]);

  // Clear response/typing timeouts on unmount or chat switch
  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current);
      if (typingStartTimeoutRef.current) clearTimeout(typingStartTimeoutRef.current);
    };
  }, [activeChatId]);

  function addChat() {
    const id = crypto.randomUUID();
    setChats((prev) => [...prev, { id, title: 'New chat' }]);
    setMessagesByChatId((prev) => ({ ...prev, [id]: [...DEFAULT_MESSAGES] }));
    setActiveChatId(id);
  }

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current);
    if (typingStartTimeoutRef.current) clearTimeout(typingStartTimeoutRef.current);
    setIsAssistantTyping(false);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setMessagesByChatId((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), userMsg],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId ? { ...c, title: getChatTitle([...(messagesByChatId[activeChatId] ?? []), userMsg]) } : c
      )
    );
    setInput('');

    typingStartTimeoutRef.current = setTimeout(() => {
      typingStartTimeoutRef.current = null;
      setIsAssistantTyping(true);
    }, TYPING_START_DELAY_MS);

    responseTimeoutRef.current = setTimeout(() => {
      responseTimeoutRef.current = null;
      if (typingStartTimeoutRef.current) {
        clearTimeout(typingStartTimeoutRef.current);
        typingStartTimeoutRef.current = null;
      }
      setIsAssistantTyping(false);
      const reply: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `You said: "${trimmed}" — this is a placeholder reply.`,
        timestamp: new Date(),
      };
      setMessagesByChatId((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] ?? []), reply],
      }));
    }, RESPONSE_DELAY_MS);
  }

  function deleteMessage(messageId: string) {
    setMessagesByChatId((prev) => {
      const list = prev[activeChatId] ?? [];
      return { ...prev, [activeChatId]: list.filter((m) => m.id !== messageId) };
    });
    setHoveredMessageId(null);
  }

  function editMessage(msg: Message) {
    setInput(msg.content);
    deleteMessage(msg.id);
    inputRef.current?.focus();
  }

  function quoteMessage(msg: Message) {
    const quoted = msg.content.split('\n').map((line) => `> ${line}`).join('\n');
    setInput((prev) => (prev ? `${prev}\n\n${quoted}` : quoted));
    inputRef.current?.focus();
  }

  function forwardMessage(_msg: Message) {
    setForwardToast('Forward (not implemented)');
    setTimeout(() => setForwardToast(null), 2000);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleAsideKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab' || !inputRef.current || !activeChat) return;
    // Forward Tab from sidebar to message input so one Tab highlights the text box
    if (!e.shiftKey) {
      const target = e.target as Node;
      if (e.currentTarget.contains(target)) {
        e.preventDefault();
        inputRef.current.focus();
      }
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900 md:flex-row">
      {/* Left aside: header + chat list — hidden on mobile (use context bar instead) */}
      <aside
        className="hidden w-56 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:flex"
        aria-label="Chat list"
        onKeyDown={handleAsideKeyDown}
      >
        <div className="shrink-0 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Chat</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Dummy chat interface</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <button
            type="button"
            onClick={addChat}
            className="mb-2 w-full rounded-lg border border-dashed border-zinc-300 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            + New chat
          </button>
          <ul className="space-y-0.5">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <li key={chat.id}>
                  <button
                    type="button"
                    onClick={() => setActiveChatId(chat.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 font-medium text-emerald-700 dark:text-emerald-400'
                        : 'text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="block truncate">{chat.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main: messages + input — min-h-0 so the scroll area can shrink and input stays at bottom */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Mobile-only context bar: chat dropdown + New chat + details icon */}
        <div
          ref={contextBarRef}
          className="flex md:hidden shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"
          aria-label="Chat context"
        >
          <div className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                setMobileChatDropdownOpen((o) => !o);
                setMobileDetailsOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              aria-expanded={mobileChatDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className="truncate">{activeChat?.title ?? 'Select chat'}</span>
              <svg className="h-4 w-4 shrink-0 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileChatDropdownOpen && (
              <ul
                className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                role="listbox"
              >
                {chats.map((chat) => (
                  <li key={chat.id} role="option" aria-selected={chat.id === activeChatId}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChatId(chat.id);
                        setMobileChatDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm ${
                        chat.id === activeChatId
                          ? 'bg-emerald-500/20 font-medium text-emerald-700 dark:text-emerald-400'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {chat.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={addChat}
            className="shrink-0 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 dark:border-zinc-600 dark:text-zinc-400"
          >
            New chat
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMobileDetailsOpen((o) => !o);
                setMobileChatDropdownOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              aria-label="Chat details"
              aria-expanded={mobileDetailsOpen}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {mobileDetailsOpen && activeChat && (
              <div
                ref={detailsPopoverRef}
                className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                role="dialog"
                aria-label="Chat details"
              >
                <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Chat details
                </h2>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Title</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100 truncate" title={activeChat.title}>
                      {activeChat.title}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Messages</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">{messages.length}</dd>
                  </div>
                  {messages.length > 0 && (
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">Last activity</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                        {messages[messages.length - 1].timestamp.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {activeChat && (
          <>
            {/* Floating panel: chat details, top right — desktop only */}
            <div
              className="absolute right-4 top-4 z-10 hidden w-56 rounded-lg border border-zinc-200 bg-white/95 px-4 py-3 shadow-lg shadow-zinc-300/50 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95 md:block"
              aria-label="Chat details"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Chat details
              </h2>
              <dl className="mt-2 space-y-1.5 text-sm">
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Title</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100 truncate" title={activeChat.title}>
                    {activeChat.title}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Messages</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">{messages.length}</dd>
                </div>
                {messages.length > 0 && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Last activity</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                      {messages[messages.length - 1].timestamp.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 pr-4 md:pr-60 lg:pr-64 bg-zinc-50 dark:bg-zinc-900"
              aria-label="Message list"
            >
              <div className="mx-auto max-w-2xl space-y-6">
                {groupMessagesByDay(messages).map(({ dateKey, messages: dayMessages }) => (
                  <div key={dateKey} className="space-y-4">
                    <div className="sticky top-0 z-10 -mx-2 flex justify-center py-2 bg-zinc-50 dark:bg-zinc-900">
                      <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                        {formatDateLabel(dateKey)}
                      </span>
                    </div>
                    {dayMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                        className={`relative flex flex-col pt-10 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        onMouseEnter={() => setHoveredMessageId(msg.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
                      >
                        <div
                          className={`relative w-full max-w-[85%] flex flex-col pb-14 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2.5 text-sm ${
                              msg.role === 'user'
                                ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                                : 'border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          </div>
                          <p
                            className={`mt-1 text-xs text-zinc-500/40 dark:text-zinc-500`}
                          >
                            {msg.timestamp.toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}
                          </p>
                          {hoveredMessageId === msg.id && (
                            <div
                              className={`absolute -top-10 mt-1 ${msg.role === 'user' ? 'right-0' : 'left-0'}`}
                            >
                              <MessageActions
                                message={msg}
                                onEdit={() => editMessage(msg)}
                                onDelete={() => deleteMessage(msg.id)}
                                onForward={() => forwardMessage(msg)}
                                onQuote={() => quoteMessage(msg)}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
                <AnimatePresence initial={false}>
                  {isAssistantTyping && <TypingIndicator key="typing" />}
                </AnimatePresence>
              </div>
            </div>
            {forwardToast && (
              <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-700">
                {forwardToast}
              </div>
            )}

            <div className="shrink-0 border-t border-zinc-200 bg-white p-2 pr-4 md:pr-60 lg:pr-64 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mx-auto flex max-w-2xl gap-2">
                <textarea
                  ref={inputRef}
                  tabIndex={0}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  rows={1}
                  className="min-h-[42px] flex-1 resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                  aria-label="Message input"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-400 dark:focus:ring-offset-zinc-950"
                >
                  Send
                </button>
              </div>
        
            </div>
          </>
        )}
      </div>
    </div>
  );
}
