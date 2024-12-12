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

  return (
    <div className="mx-auto max-w-xl space-y-6">
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
                    onChange={(e) => {
                      field.onChange(e);
                      setCoverLetterData({
                        ...coverLetterData,
                        closing: e.target.value
                      });
                    }}
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