"use client";

import useUnloadWarning from "@/hooks/useUnloadWarning";
import { ResumeServerData } from "@/lib/types";
import { cn, mapToResumeValues } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useState } from "react";
import * as React from "react";
import Footer from "./Footer";
import ResumePreviewSection from "./ResumePreviewSection";
import useAutoSaveResume from "./useAutoSaveResume";
import { TemplateId } from "@/components/templates";
import { ResumeContext } from "./ResumeContext";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? mapToResumeValues(resumeToEdit) : {
      selectedTemplate: "startup",
      workExperiences: [],
    }
  );

  const [showSmResumePreview, setShowSmResumePreview] = useState(false);

  const selectedTemplate = resumeData.selectedTemplate as TemplateId || "startup";

  const handleTemplateChange = (template: TemplateId) => {
    setResumeData(prev => ({
      ...prev,
      selectedTemplate: template
    }));
  };

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);
  useUnloadWarning(hasUnsavedChanges);

  const [currentStep, setCurrentStep] = useState<string>(steps[0].key);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      <div className="flex flex-col min-h-screen">
        <header className="space-y-1.5 border-b px-3 py-3 text-center">
          <h1 className="text-2xl font-bold">Design your resume</h1>
          <p className="text-sm text-muted-foreground">
            Follow the steps below to create your resume. Your progress will be saved automatically.
          </p>
        </header>

        <main className="relative grow">
          <div className="absolute inset-0 flex">
            <div
              className={cn(
                "w-full space-y-3 overflow-y-auto p-3 md:w-1/2 md:block",
                showSmResumePreview && "hidden"
              )}
            >
              <Breadcrumbs currentStep={currentStep} setCurrentStep={setCurrentStep} />
              {(() => {
                const CurrentStep = steps.find(
                  (step) => step.key === currentStep
                )?.component;

                return CurrentStep ? (
                  <CurrentStep
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                  />
                ) : null;
              })()}
            </div>

            <ResumePreviewSection
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
              className={cn(showSmResumePreview && "flex")}
            />
          </div>
        </main>

        <Footer 
          isSaving={isSaving}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          showSmResumePreview={showSmResumePreview}
          setShowSmResumePreview={setShowSmResumePreview}
        />
      </div>
    </ResumeContext.Provider>
  );
}
