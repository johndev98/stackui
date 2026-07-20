import { getCourseBySlug } from "@/data/fakeCourses";
import { getLessonsByCourseId } from "@/data/fakeLessons";
import { LessonCard } from "@/components/learn/LessonCard";
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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,18rem))] justify-center gap-6">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} course={course} />
      ))}
    </div>
  );
}
