"use client";

import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { SplitLayoutFooterContext } from "./SplitLayoutFooterContext";

export function SplitLayout({ children }: { children: React.ReactNode }) {
  const childArray = React.Children.toArray(children);
  const ctx = useContext(SplitLayoutFooterContext);
  const footer = ctx?.navBar;

  useEffect(() => {
    ctx?.onRendered?.();
  }, [ctx]);

  const [splitRatio, setSplitRatio] = useState<number>(34);
  const [isDragging, setIsDragging] = useState(false);
  const [showLeft, setShowLeft] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setSplitRatio(Math.min(Math.max(pct, 15), 50));
    };

    const handleUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row gap-0 h-full">
      {showLeft && (
        <div
          className="w-full min-h-0 overflow-y-auto md:h-full md:pr-4"
          style={{ flex: `0 0 ${splitRatio}%` }}
        >
          {childArray[0]}
        </div>
      )}

      {showLeft && (
        <div
          className="hidden md:flex w-3  items-center justify-center cursor-col-resize shrink-0 group"
          onMouseDown={handleDragStart}
        >
          <div
            className="w-px h-full "
            style={{
              backgroundColor: isDragging ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
            }}
          />
        </div>
      )}

      <div className="flex-1 min-w-0 min-h-0 relative flex flex-col">
        <button
          type="button"
          onClick={() => setShowLeft((v) => !v)}
          aria-label={showLeft ? "Ẩn cột trái" : "Hiện cột trái"}
          className="hidden md:flex absolute z-30 items-center justify-center w-8 h-8 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 border border-white/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
            {showLeft ? <path d="M14 9l-2 3 2 3" /> : <path d="M12 9l2 3-2 3" />}
          </svg>
        </button>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {childArray[1]}
        </div>
        {footer && (
          <div className="border-t border-white/10 bg-page-bg/90 backdrop-blur-md py-4 px-6 flex items-center justify-between gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function SplitLeft({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SplitRight({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
