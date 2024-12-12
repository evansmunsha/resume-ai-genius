"use client";

import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { fileReplacer } from "@/lib/utils";
import { CoverLetterValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveCoverLetter } from "./actions";

export default function useAutoSaveCoverLetter(coverLetterData: CoverLetterValues) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState(coverLetterData);
  const searchParams = useSearchParams();
  const coverLetterId = searchParams.get("coverLetterId");
  const { toast } = useToast();

  const debouncedData = useDebounce(coverLetterData, 1000);

  useEffect(() => {
    async function saveData() {
      if (!coverLetterId) return;
      
      try {
        setIsSaving(true);
        await saveCoverLetter({
          ...debouncedData,
          id: coverLetterId
        });
        setLastSavedData(debouncedData);
      } catch (error) {
        toast({
          title: "Error saving cover letter",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }

    if (JSON.stringify(debouncedData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer)) {
      saveData();
    }
  }, [debouncedData, coverLetterId, lastSavedData, toast]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(coverLetterData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer),
  };
}
