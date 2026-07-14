import { CodeBlock } from "@/components/code_block/CodeBlock";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

async function HomeContent() {
  const t = await getTranslations("Home");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <h1 className="text-9xl font-extrabold text-primary text-center">
        {t("title")}
      </h1>
      <span>{t("description")}</span>
      <CodeBlock lang="tsx">
        {`
import { ThemeModeScript } from 'flowbite-react';

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning>
            <head>
                <ThemeModeScript />
            </head>
            <body>{children}</body>
        </html>
    );
}
    
import { ThemeModeScript } from 'flowbite-react';

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning>
            <head>
                <ThemeModeScript />
            </head>
            <body>{children}</body>
        </html>
    );
}
`}
      </CodeBlock>
    </div>
  );
}
