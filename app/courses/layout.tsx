import { fontClasses } from "../fonts";
import CoursesShell from "./CoursesShell";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${fontClasses} h-full`}>
      <body data-page="courses" className="h-full overflow-hidden bg-page-bg ">
        <CoursesShell>{children}</CoursesShell>
      </body>
    </html>
  );
}
