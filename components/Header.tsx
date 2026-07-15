"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import Link from "next/link";

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
    `transition-colors hover:text-primary ${
      href === "/"
        ? pathname === "/"
        : pathname.startsWith(href)
          ? "text-primary"
          : ""
    }`;

  return (
    <header className="sticky top-0 z-50 bg-page-bg/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <span className="font-extrabold text-4xl text-primary">Cimimo</span>

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

        <button onClick={toggleLocale}>...</button>
      </div>
    </header>
  );
}
