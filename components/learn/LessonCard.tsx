"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Lesson } from "@/types/lesson";
import type { CourseCardProps } from "@/types/course";

type LessonCardProps = {
  lesson: Lesson;
  course: CourseCardProps;
};

export function LessonCard({ lesson, course }: LessonCardProps) {
  return (
    <Link href={`/learn/${lesson.slug}`}>
      <motion.div
        whileHover={{ scale: 1.025, borderColor: "var(--primary)" }}
        transition={{ duration: 0.3 }}
        className="flex flex-col rounded-xl border-2 border-transparent bg-(--card-bg) overflow-hidden"
      >
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={lesson.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
          {lesson.isFree && (
            <span className="absolute top-2 left-2 z-10 rounded-lg bg-green-600 px-2 py-0.5 text-xs font-bold">
              Free
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 p-3">
          <h3 className="line-clamp-2 text-lg font-semibold">{lesson.title}</h3>
          <p className="text-content text-sm mt-1">{course.title}</p>
          <div className="flex items-center gap-3 mt-auto pt-3 text-content text-sm">
            {lesson.duration && <span>⏱ {lesson.duration}</span>}
            <span>Bài {lesson.order}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
