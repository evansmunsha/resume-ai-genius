"use client";

import CoverLetterPreview from "@/components/CoverLetterPreview";
import { CoverLetterValues } from "@/lib/validation";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import ColorThemeSelector from "./ColorThemeSelector";
import { coverLetterTemplates } from "@/lib/templates";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import { canUseCustomizations } from "@/lib/permissions";
import usePremiumModal from "@/hooks/usePremiumModal";
import TemplateSelector from "./TemplateSelector";

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
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const savedTemplateId = coverLetterData.template || coverLetterTemplates[0].id;
    return coverLetterTemplates.find(t => t.id === savedTemplateId) || coverLetterTemplates[0];
  });
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

  function handleTemplateChange(templateId: string) {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }
    const template = coverLetterTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCoverLetterData({
        ...coverLetterData,
        template: template.id,
        font: template.font
      });
    }
  }

  return (
    <div className={cn("group relative hidden w-full md:flex md:w-1/2", className)}>
      <div className="absolute right-6 top-4 z-10 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <ColorThemeSelector 
          Color={themeColor}
          onChange={handleColorChange}
        />
        
        <TemplateSelector
          currentTemplate={selectedTemplate.id}
          onTemplateChange={handleTemplateChange}
        />
      </div>
      
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <CoverLetterPreview
          coverLetterData={coverLetterData}
          className="max-w-2xl shadow-md"
          font={selectedTemplate.font}
          style={{
            backgroundColor: selectedTemplate.style.backgroundColor,
          }}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
} 