import DuolingoDragDrop from "@/components/DuolingoDragDrop";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

// ✅ SHUFFLE CÓ SEED CỐ ĐỊNH → Server = Client 100%
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function shuffleSeed<T>(arr: T[], seed: string | number): T[] {
  const a = [...arr];
  let s = typeof seed === "number" ? seed : hashString(seed);
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent locale={locale} />;
}

// ✅ Truyền locale vào làm seed cố định
async function HomeContent({ locale }: { locale: string }) {
  const t = await getTranslations("Home");

  // ✅ Seed = locale → mỗi ngôn ngữ 1 thứ tự, nhưng SV = CL hoàn toàn giống nhau
  const seed = `duolingo-home-${locale}`;

  const options1 = shuffleSeed(
    [
      { id: "tinh", label: "tĩnh" },
      { id: "dong", label: "động" },
      { id: "chay", label: "chạy" },
      { id: "xay", label: "xây" },
      { id: "thu", label: "thu" },
    ],
    seed + "-1",
  );

  const options2 = shuffleSeed(
    [
      { id: "const", label: "const" },
      { id: "let", label: "let" },
      { id: "var", label: "var" },
      { id: "function", label: "function" },
      { id: "return", label: "return" },
      { id: "class", label: "class" },
    ],
    seed + "-2",
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <h1 className="text-9xl font-extrabold text-heading text-center">
        {t("title")}
      </h1>
      <span className="text-content">{t("description")}</span>

      <h2 className="max-w-2xl mx-auto text-xl font-bold text-gray-700 mb-2">
        📝 Câu 1: Điền vào chỗ trống
      </h2>
      <DuolingoDragDrop
        question={[
          {
            type: "text",
            content: "TypeScript bổ sung hệ thống kiểu dữ liệu ",
          },
          { type: "blank", id: "b1", hint: "" },
          { type: "text", content: ", giúp phát hiện lỗi trước khi " },
          { type: "blank", id: "b2", hint: "" },
          { type: "text", content: " ứng dụng, tiết kiệm thời gian " },
          { type: "blank", id: "b3", hint: "" },
          { type: "text", content: " sau này." },
        ]}
        options={options1}
        correctAnswers={{ b1: "tinh", b2: "chay", b3: "thu" }}
      />

      <h2 className="max-w-2xl mx-auto text-xl font-bold text-gray-700 mb-2 mt-10">
        💻 Câu 2: Hoàn thành đoạn code
      </h2>
      <DuolingoDragDrop
        mode="code"
        language="ts"
        accent="#89b4fa"
        question={[
          { type: "text", content: "" },
          { type: "blank", id: "c1", hint: "hằng" },
          { type: "text", content: " PI = 3.14;\n" },
          { type: "blank", id: "c2", hint: "biến" },
          { type: "text", content: " count = 0;\n\n" },
          { type: "blank", id: "c3", hint: "hàm" },
          { type: "text", content: " add(a: number, b: number) {\n  " },
          { type: "blank", id: "c4", hint: "trả về" },
          { type: "text", content: " a + b;\n}" },
        ]}
        options={options2}
        correctAnswers={{
          c1: "const",
          c2: "let",
          c3: "function",
          c4: "return",
        }}
      />
    </div>
  );
}
