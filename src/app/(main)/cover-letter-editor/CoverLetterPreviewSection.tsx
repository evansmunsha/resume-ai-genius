"use client";

import CoverLetterPreview from "@/components/CoverLetterPreview";
import { CoverLetterValues } from "@/lib/validation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ColorThemeSelector from "./ColorThemeSelector";
import { coverLetterTemplates, Template } from "@/lib/templates";
import { Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import { canUseCustomizations } from "@/lib/permissions";
import usePremiumModal from "@/hooks/usePremiumModal";

interface CoverLetterPreviewSectionProps {
  coverLetterData: CoverLetterValues;
  setCoverLetterData: (data: CoverLetterValues) => void;
  showSmCoverLetterPreview: boolean;
  setShowSmCoverLetterPreview: (show: boolean) => void;
  className?: string;
}

export default function CoverLetterPreviewSection({
  coverLetterData,
  setCoverLetterData,
  showSmCoverLetterPreview,
  setShowSmCoverLetterPreview,
  className,
}: CoverLetterPreviewSectionProps) {
  const [themeColor, setThemeColor] = useState(coverLetterData.colorHex || "#0066cc");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(coverLetterTemplates[0]);
  const [showTemplates, setShowTemplates] = useState(false);
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
    }
  }

  return (
    <div className={cn("group relative hidden w-full md:flex md:w-1/2", className)}>
      <div className="absolute right-6 top-4 z-10 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <ColorThemeSelector 
          Color={themeColor}
          onChange={handleColorChange}
        />
        
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Layout className="h-4 w-4" />
            Template
          </Button>
          
          {showTemplates && (
            <select 
              value={selectedTemplate.id} 
              onChange={(e) => {
                handleTemplateChange(e.target.value);
                setShowTemplates(false);
              }} 
              className="absolute right-0 top-full mt-1 w-[200px] border rounded p-1 max-h-[200px] overflow-y-auto bg-white shadow-lg"
              size={6}
              autoFocus
              onBlur={() => setShowTemplates(false)}
            >
              {coverLetterTemplates.map(template => (
                <option 
                  key={template.id} 
                  value={template.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {template.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <CoverLetterPreview
          coverLetterData={coverLetterData}
          className="max-w-2xl shadow-md"
          font={selectedTemplate.font}
          style={selectedTemplate.style}
        />
      </div>
    </div>
  );
} 