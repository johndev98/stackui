"use client";
import { useState } from "react";

type LivePreviewProps = {
  component: React.ComponentType;
};

export default function LivePreview({
  component: Component,
}: LivePreviewProps) {
  return (
    <div className="my-4 p-4 rounded-lg border border-white/10 bg-white/5">
      <div className="flex items-center justify-center p-4 rounded-lg min-h-30">
        <Component />
      </div>
    </div>
  );
}
