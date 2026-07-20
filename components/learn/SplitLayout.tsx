"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export function SplitLayout({ children }: { children: React.ReactNode }) {
  const childArray = React.Children.toArray(children);

  const [splitRatio, setSplitRatio] = useState<number>(() => {
    if (typeof window === "undefined") return 25;
    return Math.min(Math.max(parseInt(localStorage.getItem("splitRatio") || "25", 10), 15), 50);
  });
  const [isDragging, setIsDragging] = useState(false);
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

  useEffect(() => {
    localStorage.setItem("splitRatio", String(splitRatio));
  }, [splitRatio]);

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row gap-0 min-h-[calc(100vh-8rem)]">
      <div
        className="w-full md:overflow-y-auto md:pr-4"
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

      <div className="flex-1 min-w-0">{childArray[1]}</div>
    </div>
  );
}

export function SplitLeft({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SplitRight({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
