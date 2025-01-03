"use client";

import { cn } from "@/lib/utils";

interface StepGroup {
  title: string;
  steps: string[];
}

interface StepProgressProps {
  currentStep: string;
  stepGroups: StepGroup[];
}

export default function StepProgressIndicator({ currentStep, stepGroups }: StepProgressProps) {
  const getCurrentGroupIndex = () => {
    return stepGroups.findIndex(group => 
      group.steps.includes(currentStep)
    );
  };

  return (
    <div className="h-8 border-b bg-gray-50/50 flex items-center px-2">
      <div className="flex gap-3 items-center mx-auto">
        {stepGroups.map((_, index) => (
          <div 
            key={index}
            className={cn(
              "w-2 h-2 rounded-full",
              getCurrentGroupIndex() >= index ? "bg-green-600" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
} 