import { fontClasses } from "../fonts";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={fontClasses}>
      <body>{children}</body>
    </html>
  );
}
