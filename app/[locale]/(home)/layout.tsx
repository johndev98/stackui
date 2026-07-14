export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Header /> */}

      <main className="mx-auto w-full max-w-7xl px-6">{children}</main>

      {/* <Footer /> */}
    </>
  );
}
