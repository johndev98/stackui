import { createContext, type ReactNode } from "react";

export type SplitLayoutFooterContextValue = {
  navBar: ReactNode;
  onRendered?: () => void;
};

export const SplitLayoutFooterContext =
  createContext<SplitLayoutFooterContextValue | null>(null);
