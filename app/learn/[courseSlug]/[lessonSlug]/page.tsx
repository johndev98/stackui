import { getCourseBySlug } from "@/data/fakeCourses";
import { getLessonBySlug, getLessonsByCourseId } from "@/data/fakeLessons";
import { LessonContent } from "@/components/learn/LessonContent";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;

  // Validate route params
  if (!courseSlug || !courseSlug.trim()) {
    return notFound();
  }

  if (!lessonSlug || !lessonSlug.trim()) {
    return notFound();
  }

  const course = getCourseBySlug(courseSlug);
  if (!course) notFound();

  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) notFound();

  const lessons = getLessonsByCourseId(course.id);
  if (!lessons || lessons.length === 0) {
    return notFound();
  }

  const currentIndex = lessons.findIndex((item) => item.slug === lesson.slug);
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : undefined;

  return (
    <div className="mx-auto">
      <LessonContent
        courseSlug={course.slug}
        lessonSlug={lesson.slug}
        currentLessonTitle={lesson.title}
        nextLessonTitle={nextLesson?.title}
        nextLessonHref={
          nextLesson ? `/learn/${course.slug}/${nextLesson.slug}` : undefined
        }
        learnListHref={`/learn/${course.slug}`}
      />
    </div>
  );
}
