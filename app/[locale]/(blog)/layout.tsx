export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main data-page="blog" className="min-h-screen bg-page-bg">
      <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
    </main>
  );
}
