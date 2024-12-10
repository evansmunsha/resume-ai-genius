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
import GenerateCompanyKnowledgeButton from "./GenerateCompanyKnowledgeButton";

export default function CompanyKnowledgeForm({
  coverLetterData,
  setCoverLetterData,
}: EditorFormProps) {
  const form = useForm<CoverLetterContentValues>({
    resolver: zodResolver(coverLetterContentSchema),
    defaultValues: {
      companyKnowledge: coverLetterData.companyKnowledge || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setCoverLetterData({
        ...coverLetterData,
        companyKnowledge: values.companyKnowledge,
      });
    });
    return unsubscribe;
  }, [form, coverLetterData, setCoverLetterData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Company Knowledge</h2>
        <p className="text-sm text-muted-foreground">
          Show your understanding of the company and why you want to work there.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="companyKnowledge"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Company Knowledge</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="I am particularly drawn to [Company]'s commitment to..."
                    className="min-h-[200px]"
                  />
                </FormControl>
                <FormMessage />
                <GenerateCompanyKnowledgeButton 
                  coverLetterData={coverLetterData} 
                  onCompanyKnowledgeGenerated={companyKnowledge => form.setValue("companyKnowledge", companyKnowledge)} 
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 