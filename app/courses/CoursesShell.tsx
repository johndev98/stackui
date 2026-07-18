"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen, Menu, X } from "lucide-react";
import Sidebar from "@/components/courses/Sidebar";
import { SearchProvider } from "@/components/courses/context/SearchContext";
import SearchInput from "@/components/courses/SearchInput";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

export default function CoursesShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Tham chiếu vùng cuộn
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabletQuery = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)",
    );

    if (tabletQuery.matches) setCollapsed(true);

    function handleChange(e: MediaQueryListEvent) {
      setCollapsed(e.matches);
    }
    tabletQuery.addEventListener("change", handleChange);
    return () => tabletQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="mx-auto flex h-full max-w-350 gap-2 p-0 md:p-3">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} />
      </div>

      <SearchProvider search={search} setSearch={setSearch}>
        <main className="flex flex-1 flex-col md:rounded-xl bg-(--main-bg) relative overflow-hidden">
          <header className="flex h-16 items-center border-b border-white/5 px-6 relative z-10">
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

            {/* Mobile: Menu ↔ Close */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex h-10 w-10 items-center focus:outline-none justify-center rounded-xl hover:bg-page-bg/5"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <X size={23} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={23} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <SearchInput />
          </header>

          {/* ✅ Sử dụng component tái sử dụng */}
          <ScrollProgressIndicator
            containerRef={scrollContainerRef}
            height={5}
            color="var(--hue-1, #ededec)"
          />

          {/* Vùng nội dung cuộn */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-1 md:px-6 md:py-3"
          >
            {children}
          </div>
        </main>
      </SearchProvider>

      {/* Mobile right sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                visualDuration: 0.25,
                bounce: 0.08,
              }}
              className="fixed left-0 top-0 z-50 flex h-full w-65 flex-col rounded-r-2xl mt-16 md:hidden"
            >
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
