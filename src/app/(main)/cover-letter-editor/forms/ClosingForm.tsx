import { EditorFormProps } from "@/lib/types/types";
import { coverLetterContentSchema, CoverLetterContentValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
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
import GenerateClosingButton from "./GenerateClosingButton";
import { useEffect } from "react";

export default function ClosingForm({
  coverLetterData,
  setCoverLetterData,
}: EditorFormProps) {
  const form = useForm<CoverLetterContentValues>({
    resolver: zodResolver(coverLetterContentSchema),
    defaultValues: {
      closing: coverLetterData.closing || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setCoverLetterData({ ...coverLetterData, ...values });
    });
    return unsubscribe;
  }, [form, coverLetterData, setCoverLetterData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Closing</h2>
        <p className="text-sm text-muted-foreground">
          Thank the reader for their time and consideration.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="closing"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Closing Statement</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Thank you for considering my application. I look forward to..."
                    className="min-h-[200px]"
                    onChange={(e) => field.onChange(e.target.value)} autoFocus
                  />
                </FormControl>
                <FormMessage />
                <GenerateClosingButton  
                  onClosingGenerated={closing => form.setValue("closing", closing)} 
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 