export default function UiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}

      <main className="mx-auto w-full max-w-7xl px-8">{children}</main>

      {/* <Footer /> */}
    </>
  );
}
