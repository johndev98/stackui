"use server";
import { readFile } from "fs/promises";
import matter from "gray-matter";
import "server-only";

// Nghiêm ngặt: giữ dấu
function chuanHoaNghiemNgat(str: string) {
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}
// Linh hoạt: bỏ dấu
function chuanHoaBoDau(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function kiemTraDapAn(slug: string, cauTraLoi: string) {
  const duongDan = process.cwd() + `/content/courses/${slug}.mdx`;
  const file = await readFile(duongDan, "utf8");
  const { data } = matter(file);

  const dapAnDung = String(data.dapAnDung ?? "");
  const choPhepKhongDau = Boolean(data.choPhepKhongDau ?? false); // Mặc định = nghiêm ngặt

  const dung = choPhepKhongDau
    ? chuanHoaBoDau(cauTraLoi) === chuanHoaBoDau(dapAnDung)
    : chuanHoaNghiemNgat(cauTraLoi) === chuanHoaNghiemNgat(dapAnDung);

  return {
    dung,
    thongBao: dung
      ? "🎉 Chính xác! Bạn trả lời đúng rồi."
      : "❌ Chưa đúng, bạn thử lại nhé.",
  };
}
