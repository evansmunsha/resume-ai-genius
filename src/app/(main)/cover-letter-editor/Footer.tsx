import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUserIcon, PenLineIcon } from "lucide-react";
import Link from "next/link";
import { steps } from "./steps";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmCoverLetterPreview: boolean;
  setShowSmCoverLetterPreview: (show: boolean) => void;
  isSaving: boolean;
}

export default function Footer({
  currentStep,
  setCurrentStep,
  showSmCoverLetterPreview,
  setShowSmCoverLetterPreview,
  isSaving,
}: FooterProps) {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            Previous step
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Next step
          </Button>
        </div>
         <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSmCoverLetterPreview(!showSmCoverLetterPreview)}
          className="md:hidden"
          title={
            showSmCoverLetterPreview ? "Show input form" : "Show cover letter preview"
          }
        >
          {showSmCoverLetterPreview ? <PenLineIcon /> : <FileUserIcon />}
        </Button> 
        <div className="flex items-center gap-3">
          <Button variant="secondary" asChild>
            <Link href="/cover-letters">Close</Link>
          </Button>
          <p
            className={cn(
              "text-muted-foreground opacity-0",
              isSaving && "opacity-100",
            )}
          >
            Saving...
          </p>
        </div>
        
      </div>
    </footer>
  );
}
