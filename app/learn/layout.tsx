import { fontClasses } from "../fonts";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto w-full max-w-screen-2xl px-6">{children}</div>;
}
