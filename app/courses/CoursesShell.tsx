"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Sidebar from "@/components/courses/Sidebar";

export default function CoursesShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mx-auto flex h-full max-w-screen-2xl gap-3 p-5">
      <Sidebar collapsed={collapsed} />
      <main className="flex flex-1 flex-col rounded-2xl bg-card">
        <header className="flex h-16 items-center border-b px-6">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-foreground/5"
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
