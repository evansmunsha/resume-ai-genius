import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";
import { GenerateCompanyKnowledgeInput, generateCompanyKnowledgeSchema, CoverLetterValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import { generateCompanyKnowledge } from "./actions";

interface GenerateCompanyKnowledgeButtonProps {
  coverLetterData: CoverLetterValues;
  onCompanyKnowledgeGenerated: (companyKnowledge: string) => void;
}

export default function GenerateCompanyKnowledgeButton({
  coverLetterData,
  onCompanyKnowledgeGenerated,
}: GenerateCompanyKnowledgeButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [showInputDialog, setShowInputDialog] = useState(false);

  const initialCompanyKnowledge = coverLetterData.companyKnowledge || "";

  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={() => {
          if (!canUseAITools(subscriptionLevel)) {
            premiumModal.setOpen(true);
            return;
          }
          setShowInputDialog(true);
        }}
      >
        <WandSparklesIcon className="size-4" />
        Smart fill (AI)
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onCompanyKnowledgeGenerated={(knowledge) => {
          onCompanyKnowledgeGenerated(knowledge);
          setShowInputDialog(false);
        }}
        initialValue={initialCompanyKnowledge}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyKnowledgeGenerated: (companyKnowledge: string) => void;
  initialValue: string;
}

function InputDialog({
  open,
  onOpenChange,
  onCompanyKnowledgeGenerated,
  initialValue,
}: InputDialogProps) {
  const { toast } = useToast();
  const form = useForm<GenerateCompanyKnowledgeInput>({
    resolver: zodResolver(generateCompanyKnowledgeSchema),
    defaultValues: {
      companyKnowledge: initialValue,
    },
  });

  async function onSubmit(input: GenerateCompanyKnowledgeInput) {
    try {
      const response = await generateCompanyKnowledge(input);
      onCompanyKnowledgeGenerated(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Company Knowledge</DialogTitle>
          <DialogDescription>
            Describe what you know about the company and the AI will enhance it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="companyKnowledge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Knowledge</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="What do you know about the company?"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 