export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main data-page="home" className="min-h-screen bg-page-bg">
      <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
    </main>
  );
}
