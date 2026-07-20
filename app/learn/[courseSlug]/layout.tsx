"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { getCourseBySlug } from "@/data/fakeCourses";
import { getLessonsByCourseId, getLessonBySlug } from "@/data/fakeLessons";

export default function CourseLearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ courseSlug: string; lessonSlug?: string }>();
  const pathname = usePathname();
  const courseSlug = params.courseSlug;
  const lessonSlug = params.lessonSlug;

  const course = getCourseBySlug(courseSlug);
  const lessons = course ? getLessonsByCourseId(course.id) : [];

  const isLessonPage = pathname !== `/learn/${courseSlug}`;
  const lesson = lessonSlug ? getLessonBySlug(lessonSlug) : undefined;

  const backHref = `/courses/${courseSlug}`;
  const backLabel = "Quay lại";

  return (
    <div >
      {course && (
        <header className="sticky top-0 z-40 -mx-6 px-6 py-4 mb-6 bg-page-bg/90 backdrop-blur-md border-b border-white/10">
          {isLessonPage ? (
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href={`/learn/${courseSlug}`}
                className="text-content hover:text-heading transition-colors"
              >
                {course.title}
              </Link>
              <ChevronRight className="w-4 h-4 text-content/50 shrink-0" />
              <span className="text-heading font-semibold">
                {lesson?.title}
              </span>
            </nav>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-content hover:text-heading transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">{backLabel}</span>
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-heading">
                  {course.title}
                </h1>
                <p className="text-content">{lessons.length} bài học</p>
              </div>
            </div>
          )}
        </header>
      )}
      {children}
    </div>
  );
}
