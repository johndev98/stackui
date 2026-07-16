"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

const FILTER_OPTIONS = [
  { value: "popular" as const, label: "Phổ biến nhất" },
  { value: "free" as const, label: "Miễn phí" },
  { value: "paid" as const, label: "Trả phí" },
];

const SORT_OPTIONS = [
  { value: "popular" as const, label: "Phổ biến nhất", short: "Phổ biến" },
  { value: "price-asc" as const, label: "Giá thấp → cao", short: "↑" },
  { value: "price-desc" as const, label: "Giá cao → thấp", short: "↓" },
];
type FilterValue = (typeof FILTER_OPTIONS)[number]["value"];
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface FilterDropdownProps {
  filter: FilterValue;
  onFilterChange: (v: FilterValue) => void;
  sort: SortValue;
  onSortChange: (v: SortValue) => void;
}

export default function FilterDropdown({
  filter,
  onFilterChange,
  sort,
  onSortChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const visibleSortOptions = filter === "paid" ? SORT_OPTIONS : [];

  const filterLabel =
    FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? "Phổ biến nhất";

  const sortShort =
    SORT_OPTIONS.find((o) => o.value === sort)?.short ?? "Phổ biến";
  const showSort = filter === "paid";
  const isDefault = filter === "popular" && sort === "popular";
  const triggerLabel = isDefault
    ? "Bộ lọc"
    : showSort
      ? `${filterLabel} · ${sortShort}`
      : filterLabel;

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
      {/* Trigger */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none px-3 py-1.5"
      >
        <span>{triggerLabel}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
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
            className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-(--card-bg) border border-white/10 shadow-lg z-50 overflow-hidden"
          >
            {/* Section: Bộ lọc */}
            <p className="px-3.5 pt-3 pb-1.5 text-xs font-medium text-content">
              Bộ lọc
            </p>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onFilterChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-left text-sm transition-colors ${
                  opt.value === filter
                    ? "bg-primary/10 text-primary"
                    : "text-heading hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}

            {/* Divider + Sắp xếp section — chỉ hiện khi có sort options */}
            {visibleSortOptions.length > 0 && (
              <>
                <div className="border-t border-white/5 my-1" />
                <p className="px-3.5 pt-1.5 pb-1.5 text-xs font-medium text-content">
                  Sắp xếp
                </p>
                {visibleSortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onSortChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-sm transition-colors ${
                      opt.value === sort
                        ? "bg-primary/10 text-primary"
                        : "text-heading hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
