"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Lesson } from "@/types/lesson";

type LessonListProps = {
  lessons: Lesson[];
  initialCount?: number; // Số bài hiển thị mặc định
};

export function LessonList({ lessons, initialCount = 5 }: LessonListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleLessons = expanded ? lessons : lessons.slice(0, initialCount);
  const hasMore = lessons.length > initialCount;

  return (
    <div>
      <h3 className="text-heading font-semibold text-lg mb-3">
        {lessons.length} bài học
      </h3>
      <ul className="space-y-2">
        {visibleLessons.map((lesson) => (
          <li
            key={lesson.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 text-content text-sm"
          >
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-white/10 text-xs text-content/70">
              {lesson.order}
            </span>
            <span className="flex-1">{lesson.title}</span>
            {lesson.isFree && (
              <span className="text-xs text-green-400">Free</span>
            )}
            {lesson.duration && (
              <span className="text-xs text-content/50">{lesson.duration}</span>
            )}
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {expanded
            ? "Thu gọn"
            : `Xem thêm ${lessons.length - initialCount} bài học`}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
