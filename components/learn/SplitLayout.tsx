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

  const [splitRatio, setSplitRatio] = useState<number>(30);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const saved = parseInt(localStorage.getItem("splitRatio") || "30", 10);
    setSplitRatio(Math.min(Math.max(saved, 15), 50));
  }, []);

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

  useEffect(() => {
    localStorage.setItem("splitRatio", String(splitRatio));
  }, [splitRatio]);

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row gap-0 h-full">
      <div
        className="w-full min-h-0 overflow-y-auto md:h-full md:pr-4"
        style={{ flex: `0 0 ${splitRatio}%` }}
      >
        {childArray[0]}
      </div>

      <div
        className="hidden md:flex w-3 items-center justify-center cursor-col-resize shrink-0 group"
        onMouseDown={handleDragStart}
      >
        <div
          className="w-px h-full rounded-full transition-colors"
          style={{
            backgroundColor: isDragging ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
          }}
        />
      </div>

      <div className="flex-1 min-w-0 min-h-0 overflow-y-auto relative">
        {childArray[1]}
        {footer && (
          <div className="sticky bottom-0 border-t border-white/10 bg-page-bg/90 backdrop-blur-md py-4 px-6 flex items-center justify-between gap-4">
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
