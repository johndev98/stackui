"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type LessonStepsProps = {
  children: React.ReactNode;
  currentLessonTitle?: string;
  nextLessonTitle?: string;
  nextLessonHref?: string;
  learnListHref?: string;
  hasStepBlocks?: boolean;
};

export default function LessonSteps({
  children,
  currentLessonTitle,
  nextLessonTitle,
  nextLessonHref,
  learnListHref,
  hasStepBlocks,
}: LessonStepsProps) {
  const router = useRouter();
  const steps = useMemo(() => React.Children.toArray(children), [children]);
  const [activeStep, setActiveStep] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const lastIndex = steps.length - 1;

  if (steps.length <= 1 && !hasStepBlocks) {
    return <div>{children}</div>;
  }

  return (
    <div className="relative min-h-screen">
      <div className="h-screen overflow-hidden">{steps[activeStep]}</div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-white/10 bg-page-bg/90 backdrop-blur-md py-4 px-6 flex items-center justify-between gap-4">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="rounded-lg px-4 py-2 bg-white/5 text-sm"
        >
          Previous
        </button>

        <div className="text-sm text-content">
          Step {activeStep + 1} / {steps.length}
        </div>

        <button
          onClick={() => {
            if (activeStep === lastIndex) {
              setShowCompleteDialog(true);
            } else {
              setActiveStep(Math.min(lastIndex, activeStep + 1));
            }
          }}
          className="rounded-lg px-4 py-2 bg-primary text-black text-sm"
        >
          {activeStep === lastIndex ? "Hoàn tất" : "Next"}
        </button>
      </div>

      {showCompleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-page-bg p-6 shadow-2xl">
            <div className="mb-4 text-xl font-semibold text-heading">
              Bạn đã hoàn thành bài học "{currentLessonTitle ?? "này"}"
            </div>
            <p className="mb-6 text-content">
              {nextLessonTitle
                ? `Bạn có muốn học tiếp bài "${nextLessonTitle}"?`
                : "Bạn đã hoàn thành tất cả bài học của khóa này."}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              {nextLessonHref && (
                <button
                  onClick={() => {
                    setShowCompleteDialog(false);
                    router.push(nextLessonHref);
                  }}
                  className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Học tiếp
                </button>
              )}
              <button
                onClick={() => {
                  setShowCompleteDialog(false);
                  if (learnListHref) {
                    router.push(learnListHref);
                  } else {
                    router.back();
                  }
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-content transition hover:bg-white/10"
              >
                Quay lại danh sách bài học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
