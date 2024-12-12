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

  return (
    <div className="mx-auto max-w-xl space-y-6">
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
                    onChange={(e) => {
                      field.onChange(e);
                      form.handleSubmit((values) => {
                        setCoverLetterData({
                          ...coverLetterData,
                          ...values
                        });
                      })();
                    }}
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