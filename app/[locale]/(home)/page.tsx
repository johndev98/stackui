import DuolingoDragDrop from "@/components/DragDrop";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent locale={locale} />;
}

// ✅ Truyền locale vào làm seed cố định
async function HomeContent({ locale }: { locale: string }) {
  const t = await getTranslations("Home");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <h1 className="text-9xl font-extrabold text-heading text-center">
        {t("title")}
      </h1>
      <span className="text-content">{t("description")}</span>
    </div>
  );
}
