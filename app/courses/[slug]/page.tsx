import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/data/fakeCourses";
import Image from "next/image";
import { BaiHocPage } from "./BaiHocPage";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseSlugPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const discount =
    course.oldPrice > 0
      ? Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)
      : 0;

  return (
    <div className="max-w-3xl py-8 px-4 space-y-6">
      {/* Thumbnail */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold">{course.title}</h1>

      {/* Description */}
      <p className="text-content text-lg">{course.description}</p>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-primary">
          {course.price === 0
            ? "Miễn phí"
            : `${course.price.toLocaleString("vi-VN")}đ`}
        </span>
        {course.oldPrice > 0 && (
          <>
            <span className="text-content line-through">
              {course.oldPrice.toLocaleString("vi-VN")}đ
            </span>
            <span className="bg-red-600 text-white text-sm font-bold px-2 py-0.5 rounded-lg">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Students & Online */}
      <div className="flex gap-6 text-content">
        <span>👥 {course.students.toLocaleString("vi-VN")} đã đăng ký</span>
        <span>📺 {course.maxOnline.toLocaleString("vi-VN")} đang học</span>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {course.categories.map((cat) => (
          <span
            key={cat}
            className="px-3 py-1 rounded-lg bg-white/5 text-content text-sm capitalize"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* ✅ CHỈ DÙNG BaiHocPage - đọc/render MDX bằng fs + next-mdx-remote */}
      <div className="border-t border-white/10 pt-6">
        <BaiHocPage slug={slug} />
      </div>
    </div>
  );
}
