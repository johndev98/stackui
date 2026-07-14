"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutGrid, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { icon: LayoutGrid, label: "Khóa học", href: "/courses" },
  { icon: Users, label: "Progress", href: "/courses/progress" },
];

const SIDEBAR_WIDTH = 250;
const SIDEBAR_COLLAPSED = 68;

type SidebarProps = {
  collapsed: boolean;
};
export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <motion.aside
      animate={{ width }}
      initial={false}
      transition={
        mounted
          ? { type: "spring", visualDuration: 0.25, bounce: 0.08 }
          : undefined
      }
      className="sticky top-0 flex h-full flex-col overflow-hidden rounded-2xl bg-card"
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-5">
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.span
              key="short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-extrabold text-2xl text-primary"
            >
              Ci
            </motion.span>
          ) : (
            <motion.span
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-extrabold text-2xl text-primary"
            >
              Cimimo
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-2 px-3 pt-5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
            ${
              active
                ? "bg-primary text-background"
                : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
            }`}
            >
              <item.icon size={20} />
              <AnimatePresence mode="wait" initial={false}>
                {!collapsed && (
                  <motion.span
                    key={item.href}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
