import { getCourseBySlug } from "@/data/fakeCourses";
import { getLessonBySlug } from "@/data/fakeLessons";
import { BaiHocPage } from "@/app/courses/[slug]/BaiHocPage";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) notFound();

  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) notFound();

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <Link
        href={`/learn/${course.slug}`}
        className="inline-flex items-center gap-2 text-content hover:text-heading transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Quay lại danh sách bài học</span>
      </Link>
      <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>
      <BaiHocPage courseSlug={course.slug} lessonSlug={lesson.slug} />
    </div>
  );
}
