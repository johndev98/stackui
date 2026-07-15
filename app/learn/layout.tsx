import { fontClasses } from "../fonts";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={fontClasses}>
      <body data-page="learn" className="min-h-screen bg-page-bg">
        <div className="mx-auto w-full max-w-screen-2xl px-6">{children}</div>
      </body>
    </html>
  );
}
