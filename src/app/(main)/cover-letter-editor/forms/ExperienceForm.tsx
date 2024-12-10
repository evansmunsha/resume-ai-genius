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
import GenerateExperienceButton from "./GenerateExperienceButton";

export default function ExperienceForm({
  coverLetterData,
  setCoverLetterData,
}: EditorFormProps) {
  const form = useForm<CoverLetterContentValues>({
    resolver: zodResolver(coverLetterContentSchema),
    defaultValues: {
      experience: coverLetterData.experience || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setCoverLetterData({
        ...coverLetterData,
        experience: values.experience || "",
      });
    });
    return unsubscribe;
  }, [form, coverLetterData, setCoverLetterData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Experience</h2>
        <p className="text-sm text-muted-foreground">
          Describe your relevant experience and how it relates to this position.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Experience</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Throughout my career, I have developed strong skills in..."
                    className="min-h-[200px]"
                  />
                </FormControl>
                <FormMessage />
                <GenerateExperienceButton 
                  onExperienceGenerated={experience => form.setValue("experience", experience)} 
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 