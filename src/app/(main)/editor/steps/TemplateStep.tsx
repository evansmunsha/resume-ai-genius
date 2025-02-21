"use client";

import { templates, TemplateId } from "@/components/templates";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorFormProps } from "@/lib/types";

export default function TemplateStep({ resumeData, setResumeData }: EditorFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Choose Your Template</h2>
        <p className="text-muted-foreground">Select a template that best fits your professional style</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {Object.entries(templates).map(([id, template]) => (
          <button
            key={id}
            onClick={() => setResumeData({ ...resumeData, selectedTemplate: id as TemplateId })}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-white p-4 text-left transition-all hover:border-primary/50 hover:shadow-md",
              resumeData.selectedTemplate === id && "border-primary ring-1 ring-primary"
            )}
          >
            {/* Preview */}
            <div className="relative aspect-[210/297] mb-4 overflow-hidden rounded-lg border bg-white">
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ 
                  zoom: 'scale(0.25)',
                  transformOrigin: 'center'
                }}
              >
                <template.component
                  resumeData={{
                    ...resumeData,
                    selectedTemplate: id as TemplateId,
                  }}
                  className="pointer-events-none"
                />
              </div>
            </div>

            {/* Template Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              
              
            </div>

            {resumeData.selectedTemplate === id && (
              <div className="absolute right-3 top-3 rounded-full bg-primary p-1.5 text-white">
                <Check className="h-4 w-4" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 