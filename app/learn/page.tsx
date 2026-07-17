import { getLessonsByCourseId } from "@/data/fakeLessons";
import { getCourseBySlug } from "@/data/fakeCourses";
import { LessonCard } from "@/components/learn/LessonCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  searchParams: Promise<{ course?: string }>;
};

export default async function LearnPage({ searchParams }: Props) {
  const { course: courseSlug } = await searchParams;

  // Nếu có query ?course= → hiển thị lessons của course đó
  // Nếu không → hiển thị tất cả lessons
  const course = courseSlug ? getCourseBySlug(courseSlug) : null;
  const lessons = course ? getLessonsByCourseId(course.id) : [];

  return (
    <div className="py-8">
      {/* Back to courses */}
      {course && (
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-2 text-content hover:text-heading transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Quay lại khóa học</span>
        </Link>
      )}

      <h1 className="text-3xl font-bold mb-2">
        {course ? course.title : "Tất cả bài học"}
      </h1>
      <p className="text-content mb-6">{lessons.length} bài học</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,18rem))] justify-center gap-6">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} course={course!} />
        ))}
      </div>

      {lessons.length === 0 && (
        <p className="text-content text-center py-10">Chưa có bài học nào.</p>
      )}
    </div>
  );
}
