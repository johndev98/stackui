import { getCourseBySlug } from "@/data/fakeCourses";
import { getLessonsByCourseId } from "@/data/fakeLessons";
import { LessonCard } from "@/components/learn/LessonCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ courseSlug: string }>;
};

export default async function CourseLearnPage({ params }: Props) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) notFound();

  const lessons = getLessonsByCourseId(course.id);

  return (
    <div className="py-8">
      <Link
        href={`/courses/${course.slug}`}
        className="inline-flex items-center gap-2 text-content hover:text-heading transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Quay lại</span>
      </Link>
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-content mb-6">{lessons.length} bài học</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,18rem))] justify-center gap-6">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} course={course} />
        ))}
      </div>
    </div>
  );
}
