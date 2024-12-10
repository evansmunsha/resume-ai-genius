import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";
import { GenerateFuturePlansInput, generateFuturePlansSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import { generateFuturePlans } from "./actions";

interface GenerateFuturePlansButtonProps {
  onFuturePlansGenerated: (futurePlans: string) => void;
}

export default function GenerateFuturePlansButton({
  onFuturePlansGenerated,
}: GenerateFuturePlansButtonProps) {
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
        onFuturePlansGenerated={(futurePlans) => {
          onFuturePlansGenerated(futurePlans);
          setShowInputDialog(false);
        }}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFuturePlansGenerated: (futurePlans: string) => void;
}

function InputDialog({
  open,
  onOpenChange,
  onFuturePlansGenerated,
}: InputDialogProps) {
  const { toast } = useToast();
  const form = useForm<GenerateFuturePlansInput>({
    resolver: zodResolver(generateFuturePlansSchema),
    defaultValues: {
      futurePlans: "",
    },
  });

  async function onSubmit(input: GenerateFuturePlansInput) {
    try {
      const response = await generateFuturePlans(input);
      onFuturePlansGenerated(response);
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
          <DialogTitle>Generate Future Plans</DialogTitle>
          <DialogDescription>
            Describe your career goals and the AI will enhance them.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="futurePlans"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Future Plans</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="What are your career goals and aspirations?"
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