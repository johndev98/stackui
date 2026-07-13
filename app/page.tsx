import { CodeBlock } from "@/components/code_block/CodeBlock";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center  gap-5 p-8 ">
      <h1 className=" text-5xl text-center">Dart cơ bản 2026</h1>

      {/* Code block giống hình */}
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
