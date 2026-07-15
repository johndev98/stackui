export default function UiLayout({ children }: { children: React.ReactNode }) {
  return (
    <main data-page="ui" className="min-h-screen bg-page-bg">
      <div className="mx-auto w-full max-w-screen-2xl px-6">{children}</div>
    </main>
  );
}
