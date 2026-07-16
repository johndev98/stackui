"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSearch } from "./context/SearchContext";
import { fakeCourses } from "@/data/fakeCourses";

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-primary font-medium">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
}

export default function SearchInput() {
  const { search, setSearch } = useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = search.toLowerCase().trim();

  // Update suggestions filter
  const suggestions = useMemo(() => {
    if (q.length < 1) return [];
    return fakeCourses
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.categories.some((cat) => cat.toLowerCase().includes(q)),
      )
      .slice(0, 5)
      .map((c) => c.title);
  }, [q]);

  // Auto-focus input khi expand trên mobile
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  // Click outside → ẩn dropdown + collapse mobile
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SuggestionsDropdown = ({ className = "" }: { className?: string }) =>
    showSuggestions && suggestions.length > 0 ? (
      <div
        className={`absolute top-full left-0 right-0 mt-1 rounded-xl bg-(--card-bg) border border-white/10 shadow-lg z-50 overflow-hidden ${className}`}
      >
        {suggestions.map((title) => (
          <button
            key={title}
            onClick={() => {
              setSearch(title);
              setShowSuggestions(false);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-heading hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <Search size={14} className="text-content shrink-0" />
            <span>{highlightMatch(title, q)}</span>
          </button>
        ))}
      </div>
    ) : null;

  return (
    <div ref={containerRef} className="relative flex items-center flex-1">
      {/* Mobile: Search icon trigger */}
      <button
        onClick={() => setExpanded(true)}
        className={`md:hidden flex h-10 w-10 items-center justify-center rounded-xl hover:bg-foreground/5 shrink-0 ${
          expanded ? "hidden" : "flex"
        }`}
      >
        <Search size={23} className="text-content" />
      </button>

      {/* Desktop: always show input */}
      <div className="hidden md:block relative flex-1 mx-4 max-w-xs">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-content"
          size={16}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Tìm khóa học..."
          className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-10 pr-4 text-sm text-heading placeholder:text-content/50 focus:outline-none focus:border-primary/50 transition-colors"
        />
        <SuggestionsDropdown />
      </div>

      {/* Mobile: expanded search overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute inset-0 z-10 flex items-center gap-2 bg-(--main-bg)"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-content"
                size={16}
              />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Tìm khóa học..."
                className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-10 pr-4 text-sm text-heading placeholder:text-content/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <SuggestionsDropdown />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
