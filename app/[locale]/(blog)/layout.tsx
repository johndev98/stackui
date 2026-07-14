export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-4xl px-6">{children}</main>
  );
}
