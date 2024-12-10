import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types/types";
import { coverLetterSkillsSchema, CoverLetterSkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SkillsForm({
  coverLetterData,
  setCoverLetterData,
}: EditorFormProps) {
  const form = useForm<CoverLetterSkillsValues>({
    resolver: zodResolver(coverLetterSkillsSchema),
    defaultValues: {
      skills: coverLetterData.skills || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setCoverLetterData({
        ...coverLetterData,
        skills: values.skills
          ?.filter((skill): skill is string => 
            typeof skill === 'string' && skill.trim() !== ''
          )
          .map(skill => skill.trim()) || [],
      });
    });
    return unsubscribe;
  }, [form, coverLetterData, setCoverLetterData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          What are your key technical skills and capabilities?
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Skills</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g. Project Management, Team Leadership, Strategic Planning..."
                    onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                    value={field.value?.join(', ') || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const currentValue = e.currentTarget.value;
                        if (!currentValue.endsWith(',')) {
                          e.currentTarget.value = currentValue + ',';
                          const event = new Event('change', { bubbles: true });
                          e.currentTarget.dispatchEvent(event);
                        }
                      }
                    }}
                   
                
                  />
                </FormControl>
                <FormDescription>
                  Separate each skill with a comma.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 