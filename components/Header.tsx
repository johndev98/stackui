'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/navigation';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const next = locale === 'vi' ? 'en' : 'vi';
    router.replace(pathname, {locale: next});
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href={`/${locale}`} className="hover:text-primary transition-colors">
            {t('home')}
          </a>
          <a href={`/${locale}/blog`} className="hover:text-primary transition-colors">
            {t('blog')}
          </a>
          <a href={`/${locale}/ui`} className="hover:text-primary transition-colors">
            {t('ui')}
          </a>
        </nav>

        <button
          onClick={toggleLocale}
          className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
        >
          <span className={locale === 'vi' ? 'font-bold' : 'opacity-50'}>VI</span>
          <span className="text-border">|</span>
          <span className={locale === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
        </button>
      </div>
    </header>
  );
}
