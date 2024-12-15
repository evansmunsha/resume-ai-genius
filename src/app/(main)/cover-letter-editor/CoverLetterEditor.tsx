"use client";

import { useSearchParams } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";
import { steps } from "./steps";
import Footer from "./Footer";
import { useState } from "react";
import { CoverLetterServerData } from "@/lib/types/types";
import { cn, mapToCoverLetterValues } from "@/lib/utils";
import { CoverLetterValues } from "@/lib/validation";
import CoverLetterPreviewSection from "./CoverLetterPreviewSection";

import useAutoSaveCoverLetter from "./useAutoSaveCoverLetter";
import useUnloadWarning from "@/hooks/useUnloadWarning";

interface CoverLetterEditorProps {
  coverLetterToEdit: CoverLetterServerData | null;
}

export default function CoverLetterEditor({ coverLetterToEdit }: CoverLetterEditorProps) {

  const searchParams = useSearchParams();

  const [coverLetterData, setCoverLetterData] = useState<CoverLetterValues>(
    coverLetterToEdit ? mapToCoverLetterValues(coverLetterToEdit) : {
      recipientName: [],
      achievements: [],
      skills: [],
      opening: "",
      experience: "",
      companyKnowledge: "",
      futurePlans: "",
      closing: "",
      colorHex: "#000000",
      borderStyle: "modern",
      title: undefined,
      description: undefined,
      photo: undefined,
    }
  );

  const [showSmCoverLetterPreview, setShowSmCoverLetterPreview] = useState(false)


  
  
  const currentStep = searchParams.get("step") || steps[0].key;

  const { isSaving, hasUnsavedChanges } = useAutoSaveCoverLetter(coverLetterData);

  
  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  useUnloadWarning(hasUnsavedChanges);
  
  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;
  
  

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your Cover Letter</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your cover letter. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div className={cn("w-full space-y-3 overflow-y-auto p-3 pr-0 md:w-1/2 md:block",
            showSmCoverLetterPreview && "hidden"
          )}>
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                coverLetterData={coverLetterData}
                setCoverLetterData={setCoverLetterData}
              />
            )}
          </div>
          <div className="grow md:border-1"/>
            <CoverLetterPreviewSection
              coverLetterData={coverLetterData}
              setCoverLetterData={setCoverLetterData}
              className={cn(showSmCoverLetterPreview && "flex")}
            />
          
        </div>
      </main>
        <Footer 
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmCoverLetterPreview={showSmCoverLetterPreview}
        setShowSmCoverLetterPreview={setShowSmCoverLetterPreview} 
        isSaving={isSaving} 
      />
    </div>
  );
}
