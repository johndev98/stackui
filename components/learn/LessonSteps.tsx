"use client";

import React, { useMemo, useState } from "react";
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
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const lastIndex = Math.max(0, steps.length - 1);

  if (steps.length <= 1 && !hasStepBlocks) {
    return <div>{children}</div>;
  }

  // Ensure activeStep is within bounds
  const safeActiveStep = Math.min(activeStep, Math.max(0, steps.length - 1));
  const currentStepContent = steps[safeActiveStep];

  const handleNavigate = (href: string) => {
    try {
      if (!href || !href.trim()) {
        setNavigationError("Đường dẫn không hợp lệ. Vui lòng thử lại.");
        return;
      }
      router.push(href);
    } catch (error) {
      console.error("Navigation error:", error);
      setNavigationError("Không thể điều hướng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="relative">
      <div className=" ">{currentStepContent}</div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-white/10 bg-page-bg/90 backdrop-blur-md py-4 px-6 flex items-center justify-between gap-4">
        <button
          onClick={() => setActiveStep(Math.max(0, safeActiveStep - 1))}
          disabled={safeActiveStep === 0}
          className="rounded-lg px-4 py-2 bg-white/5 text-sm"
        >
          Previous
        </button>

        <div className="text-sm text-content">
          Step {safeActiveStep + 1} / {steps.length}
        </div>

        <button
          onClick={() => {
            if (safeActiveStep === lastIndex) {
              setShowCompleteDialog(true);
            } else {
              setActiveStep(Math.min(lastIndex, safeActiveStep + 1));
            }
          }}
          className="rounded-lg px-4 py-2 bg-primary text-black text-sm"
        >
          {safeActiveStep === lastIndex ? "Hoàn tất" : "Next"}
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
              {navigationError && (
                <div className="w-full text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-2 mb-2">
                  {navigationError}
                </div>
              )}
              {nextLessonHref && (
                <button
                  onClick={() => {
                    setShowCompleteDialog(false);
                    handleNavigate(nextLessonHref);
                  }}
                  className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Học tiếp
                </button>
              )}
              <button
                onClick={() => {
                  setShowCompleteDialog(false);
                  setNavigationError(null);
                  try {
                    if (learnListHref && learnListHref.trim()) {
                      handleNavigate(learnListHref);
                    } else {
                      router.back();
                    }
                  } catch (error) {
                    console.error("Navigation error:", error);
                    setNavigationError("Không thể quay lại. Vui lòng thử lại.");
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
