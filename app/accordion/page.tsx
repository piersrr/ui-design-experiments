"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
    id: string;
    title: string;
    content: string;
    color: string;
}

const items: AccordionItem[] = [
    {
        id: "1",
        title: "Advanced Reasoning",
        content:
            "Gemini uses advanced reasoning capabilities to think more carefully before answering, allowing it to solve complex problems and provide high-quality responses.",
        color: "bg-blue-500",
    },
    {
        id: "2",
        title: "Multimodal Understanding",
        content:
            "Built from the ground up to be multimodal, Gemini can generalize and seamlessly understand, operate across, and combine different types of information.",
        color: "bg-purple-500",
    },
    {
        id: "3",
        title: "Sophisticated Coding",
        content:
            "Gemini can understand, explain, and generate high-quality code in the world's most popular programming languages, making it a powerful tool for developers.",
        color: "bg-teal-500",
    },
];

export default function GeminiAccordion() {
    const [activeId, setActiveId] = useState<string | null>(null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-8 dark:bg-zinc-950">
            <div className="w-full max-w-md">
                <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Accordion
                </h1>

                <div className="flex flex-col isolation-auto">
                    {items.map((item, index) => {
                        const isActive = activeId === item.id;
                        const isFirst = index === 0;
                        const isLast = index === items.length - 1;

                        // Corner Logic:
                        // Top corners are rounded ONLY if:
                        // 1. This item is Active (fully separated)
                        // 2. The item ABOVE is Active (separation creates a gap, so we round our top to look like a separate block)
                        // 3. This is the First item (start of list)
                        const prevActive = index > 0 && items[index - 1].id === activeId;
                        const nextActive = index < items.length - 1 && items[index + 1].id === activeId;

                        const roundTop = isActive || isFirst || prevActive;
                        const roundBottom = isActive || isLast || nextActive;

                        const borderRadius = {
                            borderTopLeftRadius: roundTop ? 20 : 2,
                            borderTopRightRadius: roundTop ? 20 : 2,
                            borderBottomLeftRadius: roundBottom ? 20 : 2,
                            borderBottomRightRadius: roundBottom ? 20 : 2
                        };

                        return (
                            <motion.div
                                key={item.id}
                                // Removing `layout` prop to avoid scale-based distortion on borderRadius.
                                // We will rely on direct margin/height animation which triggers browser reflow.
                                // This ensures corners are perfectly crisp and vertical lines are straight.
                                animate={{
                                    ...borderRadius,
                                    marginTop: isActive ? 12 : 0,
                                    marginBottom: isActive ? 12 : 0,
                                    paddingBottom: isActive ? 0 : 0, // Reset default
                                    scale: isActive ? 1 : 1, // No scale for now, just pure sizing
                                }}
                                className={`relative overflow-hidden bg-white dark:bg-zinc-900 transition-shadow ${
                                    // Separation line logic:
                                    // Show border-bottom if I am NOT active, AND the next item is NOT active, AND I am not last.
                                    // If next item IS active, it pushes away, so no border needed (or border stays on me? Let's hide it for cleaner separation).
                                    !isActive && !nextActive && !isLast ? "border-b border-zinc-100 dark:border-zinc-800" : ""
                                    } ${isActive ? "z-10 shadow-xl ring-1 ring-zinc-900/5 dark:ring-white/10" : "z-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                    }`}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    // Separate borderRadius transition to be snappy if needed, but spring defaults are usually fine.
                                }}
                                style={{
                                    // Enforce visual "stacking" context
                                    zIndex: isActive ? 10 : 1
                                }}
                            >
                                <button
                                    onClick={() => setActiveId(isActive ? null : item.id)}
                                    className="flex w-full items-center justify-between p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${item.color}`}>
                                            <span className="font-bold text-sm">{item.id}</span>
                                        </div>
                                        <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                            {item.title}
                                        </span>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: isActive ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-5 pb-5 pt-0 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                                    {item.content}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="mt-4 flex gap-2"
                                                    >
                                                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                                                            New
                                                        </span>
                                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                            AI
                                                        </span>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
