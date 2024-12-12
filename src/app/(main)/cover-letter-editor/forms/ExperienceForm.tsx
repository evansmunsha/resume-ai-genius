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

  return (
    <div className="mx-auto max-w-xl space-y-6">
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
                    onChange={(e) => {
                      field.onChange(e);
                      setCoverLetterData({
                        ...coverLetterData,
                        experience: e.target.value
                      });
                    }}
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