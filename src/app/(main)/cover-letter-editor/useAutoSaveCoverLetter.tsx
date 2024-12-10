"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { fileReplacer } from "@/lib/utils";
import { CoverLetterValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveCoverLetter } from "./actions";

export default function useAutoSaveCoverLetter(coverLetterData: CoverLetterValues) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const debouncedCoverLetterData = useDebounce(coverLetterData, 1500);

  const [coverLetterId, setCoverLetterId] = useState(coverLetterData.id);
  const [lastSavedData, setLastSavedData] = useState(structuredClone(coverLetterData));
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedCoverLetterData]);

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(debouncedCoverLetterData);

        const updatedCoverLetter = await saveCoverLetter({
          ...newData,
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: coverLetterId,
        });

        if (!updatedCoverLetter) {
          throw new Error("Failed to save cover letter");
        }

        setCoverLetterId(updatedCoverLetter.id);
        setLastSavedData(newData);

        if (searchParams.get("coverLetterId") !== updatedCoverLetter.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("coverLetterId", updatedCoverLetter.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`,
          );
        }
      } catch (error) {
        setIsError(true);
        console.error(error);
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedCoverLetterData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedCoverLetterData && !isSaving && !isError) {
      save();
    }
  }, [
    debouncedCoverLetterData,
    isSaving,
    lastSavedData,
    isError,
    coverLetterId,
    searchParams,
    toast,
  ]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(coverLetterData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer),
  };
}
