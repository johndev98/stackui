"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import Link from "next/link";
import { motion, spring } from "motion/react";

export default function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const next = locale === "vi" ? "en" : "vi";
    router.replace(pathname, { locale: next });
  };

  const navClass = (href: string) =>
    `transition-colors hover:text-primary ${href === "/"
      ? pathname === "/"
      : pathname.startsWith(href)
        ? "text-primary"
        : ""
    }`;
  const text = "Unezen";

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  } as const;

  const letter = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  } as const;
  return (
    <header className="sticky top-0 z-50 bg-page-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href={`/${locale}`} className={navClass("/")}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex"
          >
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letter}
                className="font-extrabold text-4xl text-primary"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </Link>

        <nav className="flex items-center gap-10 text-sm font-medium">
          <Link href={`/${locale}`} className={navClass("/")}>
            {t("home")}
          </Link>

          <Link href={`/${locale}/blog`} className={navClass("/blog")}>
            {t("blog")}
          </Link>

          <Link href={`/${locale}/ui`} className={navClass("/ui")}>
            {t("ui")}
          </Link>

          <Link
            href="/courses"
            className="transition-colors hover:text-primary"
          >
            {t("courses")}
          </Link>
        </nav>

        <button
          onClick={toggleLocale}
          className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
        >
          <span className={locale === "vi" ? "font-bold" : "opacity-50"}>
            {" "}
            VI{" "}
          </span>{" "}
          <span className="text-border">|</span>{" "}
          <span className={locale === "en" ? "font-bold" : "opacity-50"}>
            {" "}
            EN{" "}
          </span>
        </button>
      </div>
    </header>
  );
}
