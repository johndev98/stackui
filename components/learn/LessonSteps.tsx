"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function LessonSteps({
  children,
}: {
  children: React.ReactNode;
}) {
  const steps = useMemo(() => React.Children.toArray(children), [children]);
  const [activeStep, setActiveStep] = useState(0);
  const lastIndex = steps.length - 1;

  if (steps.length <= 1) {
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
          onClick={() => setActiveStep(Math.min(lastIndex, activeStep + 1))}
          className="rounded-lg px-4 py-2 bg-primary text-black text-sm"
        >
          {activeStep === lastIndex ? "Hoàn tất" : "Next"}
        </button>
      </div>
    </div>
  );
}
