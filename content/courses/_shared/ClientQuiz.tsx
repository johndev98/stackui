"use client";
import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { kiemTraDapAn } from "@/content/courses/_shared/actions";

type KetQua = { dung: boolean; thongBao: string };

export function FillBlankQuiz() {
  const { slug } = useParams<{ slug: string }>();
  const [giaTri, setGiaTri] = useState("");
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [dangGui, batDauGui] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!giaTri.trim() || dangGui) return;

    batDauGui(async () => {
      const res = await kiemTraDapAn(String(slug), giaTri);
      setKetQua(res);
    });
  }

  return (
    <form
      onSubmit={submit}
      className="mt-5 p-4 border rounded-xl bg-white/5 space-y-3"
      style={{ scrollbarGutter: "stable" }}
    >
      <label className="block text-sm text-content">
        Điền đáp án của bạn vào ô dưới:
      </label>

      <input
        type="text"
        value={giaTri}
        onChange={(e) => setGiaTri(e.target.value)}
        placeholder="Nhập đáp án..."
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500"
        disabled={dangGui}
      />

      <button
        type="submit"
        disabled={dangGui || !giaTri.trim()}
        className="min-w-[160px] min-h-[42px] px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {dangGui ? "Đang kiểm tra..." : "✅ Gửi đáp án"}
      </button>

      <div style={{ minHeight: "56px" }}>
        {ketQua && (
          <div
            className={`p-3 rounded-lg border ${
              ketQua.dung
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <p className="font-semibold">{ketQua.thongBao}</p>
          </div>
        )}
      </div>
    </form>
  );
}
