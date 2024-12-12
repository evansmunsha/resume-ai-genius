"use client";

import CoverLetterPreview from "@/components/CoverLetterPreview";
import { CoverLetterValues } from "@/lib/validation";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import ColorThemeSelector from "./ColorThemeSelector";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import { canUseCustomizations } from "@/lib/permissions";
import usePremiumModal from "@/hooks/usePremiumModal";

interface CoverLetterPreviewSectionProps {
  coverLetterData: CoverLetterValues;
  setCoverLetterData: (data: CoverLetterValues) => void;
  className?: string;
}

export default function CoverLetterPreviewSection({
  coverLetterData,
  setCoverLetterData,
  className,
}: CoverLetterPreviewSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [themeColor, setThemeColor] = useState(coverLetterData.colorHex || "#0066cc");
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();

  function handleColorChange(color: { hex: string }) {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }
    setThemeColor(color.hex);
    setCoverLetterData({
      ...coverLetterData,
      colorHex: color.hex
    });
  }

  return (
    <div className={cn("group relative hidden w-full md:flex md:w-1/2", className)}>
      <div className="absolute right-6 top-4 z-10 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <ColorThemeSelector 
          Color={themeColor}
          onChange={handleColorChange}
        />
      </div>
      
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <CoverLetterPreview
          coverLetterData={coverLetterData}
          className="max-w-2xl shadow-md"
          style={{
            backgroundColor: 'white'
          }}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
} 