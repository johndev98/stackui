"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Tag } from "lucide-react";

interface CategoryDropdownProps {
  categories: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  align?: "left" | "right";
}

export default function CategoryDropdown({
  categories,
  value,
  onChange,
  align = "left",
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = value ?? "Tất cả";

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
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none
          justify-center px-3 py-1"
      >
        <span className="capitalize">{currentLabel}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className=""
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-full mt-1.5 w-44 rounded-xl bg-(--card-bg) border border-white/10 shadow-lg z-50 overflow-hidden ${
              align === "left" ? "left-0" : "right-0"
            }`}
          >
            {/* Tất cả */}
            <button
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 text-left text-sm transition-colors ${
                value === null
                  ? "bg-primary/10 text-primary"
                  : "text-heading hover:bg-white/5"
              }`}
            >
              Tất cả
            </button>
            {/* Divider */}
            <div className="border-t border-white/5" />
            {/* Categories */}
            <div className="max-h-70 overflow-y-auto overscroll-contain">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onChange(cat);
                    setOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 text-left text-sm transition-colors capitalize ${
                    value === cat
                      ? "bg-primary/10 text-primary"
                      : "text-heading hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
