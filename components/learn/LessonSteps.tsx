"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SplitLayoutFooterContext,
  type SplitLayoutFooterContextValue,
} from "./SplitLayoutFooterContext";

type StepContentAreaProps = {
  stepContent: React.ReactNode;
  navBar: React.ReactNode;
  hasSplitLayout: boolean;
  active: boolean;
};

function StepContentArea({
  stepContent,
  navBar,
  hasSplitLayout,
  active,
}: StepContentAreaProps) {
  const contextValue: SplitLayoutFooterContextValue = useMemo(
    () => ({ navBar, onRendered: () => {} }),
    [navBar],
  );

  return (
    <SplitLayoutFooterContext.Provider value={contextValue}>
      <div
        className={`flex flex-col flex-1 min-h-0 ${active ? "" : "hidden"}`}
      >
        <div className="flex-1 min-h-0 overflow-hidden">{stepContent}</div>
        {!hasSplitLayout && (
          <div className="shrink-0 border-t border-white/10 bg-page-bg/90 backdrop-blur-md py-4 px-6 flex items-center justify-between gap-4">
            {navBar}
          </div>
        )}
      </div>
    </SplitLayoutFooterContext.Provider>
  );
}

type LessonStepsProps = {
  children: React.ReactNode;
  currentLessonTitle?: string;
  nextLessonTitle?: string;
  nextLessonHref?: string;
  learnListHref?: string;
  hasStepBlocks?: boolean;
  stepHasSplitLayout?: boolean[];
};

export default function LessonSteps({
  children,
  currentLessonTitle,
  nextLessonTitle,
  nextLessonHref,
  learnListHref,
  hasStepBlocks,
  stepHasSplitLayout,
}: LessonStepsProps) {
  const router = useRouter();
  const steps = useMemo(() => React.Children.toArray(children), [children]);
  const [activeStep, setActiveStep] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const lastIndex = Math.max(0, steps.length - 1);

  const safeActiveStep = Math.min(activeStep, Math.max(0, steps.length - 1));

  const handleNavigate = useCallback(
    (href: string) => {
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
    },
    [router],
  );

  const navBar = useMemo(
    () => (
      <>
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
      </>
    ),
    [safeActiveStep, steps.length, lastIndex],
  );

  if (steps.length <= 1 && !hasStepBlocks) {
    return <div>{children}</div>;
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-8rem)]">
      {steps.map((stepContent, index) => (
        <StepContentArea
          key={index}
          stepContent={stepContent}
          navBar={navBar}
          hasSplitLayout={stepHasSplitLayout?.[index] ?? false}
          active={index === safeActiveStep}
        />
      ))}

      {showCompleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-page-bg p-6 shadow-2xl">
            <div className="mb-4 text-xl font-semibold text-heading">
              Bạn đã hoàn thành bài học &ldquo;{currentLessonTitle ?? "này"}&rdquo;
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
