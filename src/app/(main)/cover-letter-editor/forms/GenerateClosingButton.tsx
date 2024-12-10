import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";
import { GenerateClosingInput, generateClosingSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import { generateClosing } from "./actions";

interface GenerateClosingButtonProps {
  onClosingGenerated: (closing: string) => void;
}

export default function GenerateClosingButton({
  onClosingGenerated,
}: GenerateClosingButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [showInputDialog, setShowInputDialog] = useState(false);

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
        onClosingGenerated={(closing) => {
          onClosingGenerated(closing);
          setShowInputDialog(false);
        }}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClosingGenerated: (closing: string) => void;
}

function InputDialog({
  open,
  onOpenChange,
  onClosingGenerated,
}: InputDialogProps) {
  const { toast } = useToast();
  const form = useForm<GenerateClosingInput>({
    resolver: zodResolver(generateClosingSchema),
    defaultValues: {
      closing: "",
    },
  });

  async function onSubmit(input: GenerateClosingInput) {
    try {
      const response = await generateClosing(input);
      onClosingGenerated(response);
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
          <DialogTitle>Generate Closing</DialogTitle>
          <DialogDescription>
            Describe how you want to close your letter and the AI will enhance it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="closing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Statement</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="How would you like to close your letter?"
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