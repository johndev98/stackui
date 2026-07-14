import { fontClasses } from "../fonts";
import CoursesShell from "./CoursesShell";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${fontClasses} h-full`}>
      <body className="h-full overflow-hidden bg-background">
        <CoursesShell>{children}</CoursesShell>
      </body>
    </html>
  );
}