export default function UiLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6">{children}</main>
  );
}
