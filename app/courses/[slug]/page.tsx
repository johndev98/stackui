import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/data/fakeCourses";
import Image from "next/image";
import { BaiHocPage } from "./BaiHocPage";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLessonsByCourseId } from "@/data/fakeLessons";
import { LessonList } from "@/components/courses/LessonList";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseSlugPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const lessons = getLessonsByCourseId(course.id);
  const discount =
    course.oldPrice > 0
      ? Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)
      : 0;
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* ===== BACK BUTTON ===== */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-content hover:text-heading transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Quay lại</span>
      </Link>
      {/* ===== MOBILE: hiển thị đầu tiên ===== */}
      <div className="lg:hidden space-y-5 mb-6">
        {/* Thumbnail */}
        <div className="relative h-52 w-full rounded-xl overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
        {/* Title & Info */}
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-content">{course.description}</p>

        <div className="flex gap-6 text-content text-sm">
          <span>👥 {course.students.toLocaleString("vi-VN")} đã đăng ký</span>
          <span>📺 {course.maxOnline.toLocaleString("vi-VN")} đang học</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {course.categories.map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded bg-white/10 text-content text-xs capitalize"
            >
              {cat}
            </span>
          ))}
        </div>
        {/* Price + Button */}
        {/* ✅ Mới — responsive: mobile dọc, tablet ngang */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              {course.price === 0
                ? "Miễn phí"
                : `${course.price.toLocaleString("vi-VN")}đ`}
            </span>
            {course.oldPrice > 0 && (
              <>
                <span className="text-content line-through text-sm">
                  {course.oldPrice.toLocaleString("vi-VN")}đ
                </span>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Button */}
          <button className="md:w-auto py-3 px-6 rounded-lg bg-primary text-black font-bold text-center hover:opacity-90 transition-opacity">
            Bắt đầu học
          </button>
        </div>
      </div>

      {/* ===== DESKTOP: Layout 3:1 ===== */}
      <div className="hidden lg:flex gap-8">
        {/* LEFT — 3/4 content */}
        <div className="flex-3 min-w-0 space-y-6">
          {/* Thumbnail */}
          <div className="relative h-72 w-full rounded-xl overflow-hidden">
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

          {/* ★ LESSONS LIST — desktop */}
          <div className="border-t border-white/10 pt-6">
            <LessonList lessons={lessons} initialCount={4} />
          </div>

          {/* MDX Content */}
          <div className="border-t border-white/10 pt-6">
            <BaiHocPage slug={slug} />
          </div>
        </div>

        {/* RIGHT — 1/4 sidebar (sticky) */}
        <div className="lg:w-70 shrink-0">
          <div className="lg:sticky lg:top-24 rounded-xl border border-white/10 bg-white/5 p-6 space-y-5">
            {/* Price */}
            <div className="space-y-1">
              <span className="text-3xl font-bold text-primary">
                {course.price === 0
                  ? "Miễn phí"
                  : `${course.price.toLocaleString("vi-VN")}đ`}
              </span>
              {course.oldPrice > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-content line-through text-sm">
                    {course.oldPrice.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                    -{discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Students & Online */}
            <div className="space-y-2 text-content text-sm">
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span>
                  {course.students.toLocaleString("vi-VN")} đã đăng ký
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>📺</span>
                <span>{course.maxOnline.toLocaleString("vi-VN")} đang học</span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {course.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded bg-white/10 text-content text-xs capitalize"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Button */}
            <button className="w-full py-3 rounded-lg bg-primary text-black font-bold text-center hover:opacity-90 transition-opacity">
              Bắt đầu học
            </button>
            <hr className="border-white/10" />
          </div>
        </div>
      </div>

      {/* ===== LESSONS LIST — mobile/tablet ===== */}
      <div className="lg:hidden border-t border-white/10 pt-6 mt-6">
        <LessonList lessons={lessons} initialCount={3} />
      </div>

      {/* ===== MDX Content — mobile/tablet only, LUÔN CUỐI ===== */}
      <div className="lg:hidden border-t border-white/10 pt-6 mt-6">
        <BaiHocPage slug={slug} />
      </div>
    </div>
  );
}
