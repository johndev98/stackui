"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Funnel } from "lucide-react";

const SORT_OPTIONS = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface SortDropdownProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SORT_OPTIONS.find((o) => o.value === value);

  // Click outside → close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 text-heading hover:bg-white/10 transition-colors focus:outline-none
    h-10 w-10 justify-center md:w-auto md:px-3.5 md:h-auto"
      >
        {/* Mobile: chỉ icon */}
        <Funnel size={18} className="md:hidden" />

        {/* Desktop: label + chevron nhỏ */}
        <span className="hidden md:inline">{current?.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="hidden md:inline-block"
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1.5 w-38 rounded-xl bg-(--card-bg) border border-white/10 shadow-lg z-50 overflow-hidden"
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-left text-sm transition-colors
                  ${
                    opt.value === value
                      ? "bg-primary/10 text-primary"
                      : "text-heading hover:bg-white/5"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
