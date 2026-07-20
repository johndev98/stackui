import { fontClasses } from "../fonts";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={fontClasses}>
      <body data-page="learn" className="bg-page-bg min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-6">{children}</div>
      </body>
    </html>
  );
}
