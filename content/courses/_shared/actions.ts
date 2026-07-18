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

export async function kiemTraDapAn(
  courseSlug: string,
  lessonSlug: string | null,
  cauTraLoi: string,
  quizId: string | null,
) {
  try {
    // Validate inputs
    if (!courseSlug || !courseSlug.trim()) {
      return {
        dung: false,
        thongBao: "❌ Lỗi: Khóa học không hợp lệ.",
      };
    }

    if (!cauTraLoi || !cauTraLoi.trim()) {
      return {
        dung: false,
        thongBao: "❌ Vui lòng nhập đáp án.",
      };
    }

    const fileName = lessonSlug ?? "_index";
    const cwd = process.cwd();
    if (!cwd) {
      return {
        dung: false,
        thongBao: "❌ Lỗi: Không thể xác định thư mục làm việc.",
      };
    }

    const duongDan = `${cwd}/content/courses/${courseSlug}/${fileName}.mdx`;
    const file = await readFile(duongDan, "utf8");
    const parsed = matter(file);
    const { data } = parsed;

    if (!data) {
      return {
        dung: false,
        thongBao: "❌ Lỗi: Không thể đọc nội dung bài học.",
      };
    }

    let dapAnDung = "";
    if (quizId && data.quiz && typeof data.quiz === "object") {
      // Validate quizId exists in quiz object
      if (quizId in data.quiz) {
        dapAnDung = String(data.quiz[quizId] ?? "");
      }
    } else {
      // Format cũ: dapAnDung: "tĩnh" (backward compatible)
      dapAnDung = String(data.dapAnDung ?? "");
    }

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
  } catch (error) {
    console.error("Error in kiemTraDapAn:", error);
    return {
      dung: false,
      thongBao: "❌ Lỗi khi kiểm tra đáp án. Vui lòng thử lại.",
    };
  }
}
