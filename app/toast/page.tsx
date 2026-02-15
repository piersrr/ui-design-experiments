"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { CheckCircle2, Info, AlertCircle, AlertTriangle, Bell, X } from "lucide-react";

type ToastType = "success" | "info" | "warning" | "error";

interface Toast {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
}

const TOAST_MESSAGES: { message: string; description?: string; type: ToastType }[] = [
  { message: "Changes saved successfully", type: "success" },
  { message: "New update available", description: "Version 2.1 includes dark mode and performance improvements.", type: "info" },
  { message: "Session will expire in 5 minutes", type: "warning" },
  { message: "Failed to sync data", type: "error" },
  { message: "File uploaded", type: "success" },
  { message: "You have 3 unread messages", description: "Check your inbox to stay up to date.", type: "info" },
  { message: "Storage almost full", type: "warning" },
  { message: "Connection lost", type: "error" },
  { message: "Profile updated", type: "success" },
  { message: "Backup completed", description: "Your data has been safely backed up to the cloud.", type: "info" },
];

const DURATION_MS = 10000;
const ADD_INTERVAL_MS = 4000;

const typeStyles: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; iconColor: string }> = {
  success: { icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-300/30 dark:border-emerald-700/60", iconColor: "text-emerald-600 dark:text-emerald-400" },
  info: { icon: Info, bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-300/30 dark:border-blue-700/60", iconColor: "text-blue-600 dark:text-blue-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-300/30 dark:border-amber-700/60", iconColor: "text-amber-600 dark:text-amber-400" },
  error: { icon: AlertCircle, bg: "bg-red-50 dark:bg-red-950/40", border: "border-red-300/30 dark:border-red-700/60", iconColor: "text-red-600 dark:text-red-400" },
};

function generateId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ToastPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const mountedRef = useRef(true);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const scheduleRemoval = useCallback((id: string) => {
    timersRef.current.delete(id);
    const timer = setTimeout(() => {
      timersRef.current.delete(id);
      if (mountedRef.current) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
    }, DURATION_MS);
    timersRef.current.set(id, timer);
  }, []);

  const cancelRemoval = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(() => {
    const { message, description, type } = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, description, type }]);
    scheduleRemoval(id);
  }, [scheduleRemoval]);

  useEffect(() => {
    mountedRef.current = true;
    const initialTimer = setTimeout(addToast, 800);
    const interval = setInterval(addToast, ADD_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [addToast]);

  const dismissToast = useCallback((id: string) => {
    cancelRemoval(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, [cancelRemoval]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-100 p-8 dark:bg-zinc-950">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        Toast Notifications
      </h1>
      <p className="mb-12 text-sm text-zinc-500 dark:text-zinc-400">
        New toasts appear at the bottom and move up as older ones dismiss
      </p>

      <div className="relative z-50 flex max-h-[70vh] w-96 flex-col  px-6 py-4">
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false} mode="popLayout">
            {toasts.map((toast) => {
              const { icon: Icon, bg, border, iconColor } = typeStyles[toast.type];
              return (
                <motion.div
                  key={toast.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                    layout: { type: "spring", stiffness: 350, damping: 30 },
                  }}
                  onMouseEnter={() => cancelRemoval(toast.id)}
                  onMouseLeave={() => scheduleRemoval(toast.id)}
                  className={`flex w-full min-w-0 items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${border} ${bg}`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {toast.message}
                    </span>
                    {toast.description && (
                      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {toast.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    aria-label="Dismiss notification"
                    className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {toasts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-8 py-12 dark:border-zinc-700 dark:bg-zinc-900/30"
        >
          <Bell className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Waiting for toasts…
          </p>
        </motion.div>
      )}
    </div>
  );
}
