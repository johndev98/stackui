"use client";

import React from "react";

export function SplitLayout({ children }: { children: React.ReactNode }) {
  const childArray = React.Children.toArray(children);
  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      <div className="w-full md:w-1/4 overflow-y-auto md:pr-4 md:border-r border-white/10">
        {childArray[0]}
      </div>
      <div className="w-full md:w-3/4">{childArray[1]}</div>
    </div>
  );
}

export function SplitLeft({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SplitRight({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

