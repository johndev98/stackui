"use client";

import { useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import DuolingoDragDrop from "@/components/DragDrop";
import type { BlankSegment, AnswerOption } from "@/components/DragDrop";
import { CheckAnswersDragDropQuiz } from "@/components/learn/actions";

type DragDropQuizProps = {
  id: string;
  mode?: "text" | "code";
  question: string;
  options: string;
  language?: string;
  accent?: string;
};

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseQuestion(template: string): BlankSegment[] {
  template = template.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  const segments: BlankSegment[] = [];
  const regex = /\{(\d+)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: template.slice(lastIndex, match.index),
      });
    }
    segments.push({ type: "blank", id: `b${match[1]}` });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < template.length) {
    segments.push({ type: "text", content: template.slice(lastIndex) });
  }

  return segments;
}

function parseOptions(optionsStr: string): AnswerOption[] {
  return optionsStr
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
    .map((label, i) => ({ id: `o${i}`, label }));
}

export function DragDropQuiz({
  id,
  mode = "text",
  question,
  options,
  language = "ts",
  accent,
}: DragDropQuizProps) {
  const params = useParams<{
    slug?: string;
    courseSlug?: string;
    lessonSlug?: string;
  }>();
  const courseSlug = params.slug ?? params.courseSlug ?? "";
  const lessonSlug = params.lessonSlug ?? null;
  const blankSegments = useMemo(() => parseQuestion(question), [question]);
  const rawOptions = useMemo(() => parseOptions(options), [options]);
  const shuffledOptions = useMemo(
    () => shuffleArray(rawOptions, hashString(id)),
    [rawOptions, id],
  );

  const blankIds = useMemo(
    () =>
      blankSegments
        .filter(
          (s): s is Extract<BlankSegment, { type: "blank" }> =>
            s.type === "blank",
        )
        .map((s) => s.id),
    [blankSegments],
  );

  const labelMap = useMemo(() => {
    const m: Record<string, string> = {};
    shuffledOptions.forEach((o) => (m[o.id] = o.label));
    return m;
  }, [shuffledOptions]);

  const handleCheck = useCallback(
    async (userAnswers: Record<string, string>) => {
      if (!courseSlug?.trim()) {
        return {
          isCorrect: false,
          explanation: "Lỗi: không thể xác định khóa học.",
        };
      }

      try {
        const answerLabels = blankIds.map(
          (bid) => labelMap[userAnswers[bid]] ?? "",
        );
        const res = await CheckAnswersDragDropQuiz(
          courseSlug,
          lessonSlug,
          answerLabels,
          id,
        );
        return {
          isCorrect: res.isCorrect,
          explanation: res.thongBao,
          slotStates: res.slotStates as
            | Record<string, "idle" | "correct" | "wrong">
            | undefined,
        };
      } catch {
        return { isCorrect: false, explanation: "Lỗi khi kiểm tra. Thử lại." };
      }
    },
    [courseSlug, lessonSlug, id, blankIds, labelMap],
  );

  const isCode = mode === "code";
  const finalAccent = accent ?? (isCode ? "#7aa2f7" : "#58cc02");

  return (
    <div className="md:m-8">
      <DuolingoDragDrop
        question={blankSegments}
        options={shuffledOptions}
        accent={finalAccent}
        mode={mode}
        language={language as any}
        onCheck={handleCheck}
      />
    </div>
  );
}
