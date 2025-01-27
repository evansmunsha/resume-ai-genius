"use client";

import { ResumeValues } from "@/lib/validation";
import { createContext, useContext } from "react";

interface ResumeContextType {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

export const ResumeContext = createContext<ResumeContextType | null>(null);

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResumeContext must be used within a ResumeContextProvider");
  }
  return context;
}
