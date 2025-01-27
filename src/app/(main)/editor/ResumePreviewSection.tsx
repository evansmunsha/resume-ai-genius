"use client";

import { TemplateId, templates } from "@/components/templates/index";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { Dispatch, SetStateAction } from "react";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";


interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: Dispatch<SetStateAction<ResumeValues>>;
  selectedTemplate: TemplateId;
  onTemplateChange: (template: TemplateId) => void;
  className?: string;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
  selectedTemplate,
  className,
}: ResumePreviewSectionProps) {
  const Template = templates[selectedTemplate]?.component;

  if (!Template) {
    return <div>Template not found</div>;
  }

  return (
    <div
      className={cn("group relative hidden w-full md:flex md:w-1/2", className)}
    >
      <div className="absolute right-6 top-4 z-10 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <ColorPicker
          color={resumeData?.colorHex}
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color.hex })
          }
        />
        <BorderStyleButton
          borderStyle={resumeData.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({ ...resumeData, borderStyle })
          }
        />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <Template 
          resumeData={resumeData}
          className="max-w-2xl shadow-md"
        />
      </div>
    </div>
  );
}
