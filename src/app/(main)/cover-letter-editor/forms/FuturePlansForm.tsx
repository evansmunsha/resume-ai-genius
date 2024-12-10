import { EditorFormProps } from "@/lib/types/types";
import { coverLetterContentSchema, CoverLetterContentValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GenerateFuturePlansButton from "./GenerateFuturePlansButton";

export default function FuturePlansForm({
  coverLetterData,
  setCoverLetterData,
}: EditorFormProps) {
  const form = useForm<CoverLetterContentValues>({
    resolver: zodResolver(coverLetterContentSchema),
    defaultValues: {
      futurePlans: coverLetterData.futurePlans || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setCoverLetterData({
        ...coverLetterData,
        futurePlans: values.futurePlans || "",
      });
    });
    return unsubscribe;
  }, [form, coverLetterData, setCoverLetterData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Future Plans</h2>
        <p className="text-sm text-muted-foreground">
          Describe your career goals and how this position aligns with them.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="futurePlans"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Future Plans</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Looking ahead, I am excited about the opportunity to..."
                    className="min-h-[200px]"
                  />
                </FormControl>
                <FormMessage />
                <GenerateFuturePlansButton 
                  onFuturePlansGenerated={futurePlans => form.setValue("futurePlans", futurePlans)} 
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 