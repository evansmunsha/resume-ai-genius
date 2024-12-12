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
import GenerateOpeningButton from "./GenerateOpeningButton";

export default function OpeningForm({
  coverLetterData,
  setCoverLetterData,
}: EditorFormProps) {
  const form = useForm<CoverLetterContentValues>({
    resolver: zodResolver(coverLetterContentSchema),
    defaultValues: {
      opening: coverLetterData.opening || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      form.handleSubmit(() => {})();
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Opening Statement</h2>
        <p className="text-sm text-muted-foreground">
          Write why you want this job, or let AI help create an opening after you&apos;ve filled out the other sections.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="opening"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Opening Statement</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="I am writing to express my strong interest in the [Position] role at [Company]..."
                    className="min-h-[200px]"
                    onChange={(e) => {
                      field.onChange(e);
                      setCoverLetterData({
                        ...coverLetterData,
                        opening: e.target.value
                      });
                    }}
                  />
                </FormControl>
                <FormMessage />
                <GenerateOpeningButton coverLetterData={coverLetterData} onOpeningGenerated={opening => form.setValue("opening", opening)} />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 