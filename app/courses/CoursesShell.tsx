"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen, Menu, X } from "lucide-react";
import Sidebar from "@/components/courses/Sidebar";

export default function CoursesShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div className="mx-auto flex h-full max-w-350 gap-2 p-0 md:p-3 ">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} />
      </div>

      <main className="flex flex-1 flex-col md:rounded-xl bg-(--main-bg)">
        <header className="flex h-16 items-center border-b border-white/5 px-6">
          {/* Desktop: toggle collapse */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl hover:bg-foreground/5"
          >
            {collapsed ? (
              <PanelLeftOpen size={23} />
            ) : (
              <PanelLeftClose size={23} />
            )}
          </button>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex h-10 w-10 items-center justify-center  rounded-xl hover:bg-page-bg/5"
          >
            <Menu size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 ">{children}</div>
      </main>

      {/* Mobile right sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                visualDuration: 0.25,
                bounce: 0.08,
              }}
              className="fixed right-0 top-0 z-50 flex h-full w-65 flex-col rounded-l-2xl bg-card p-5 md:hidden"
            >
              {/* Close button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-foreground/5"
                >
                  <X size={18} />
                </button>
              </div>

              <Sidebar
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
