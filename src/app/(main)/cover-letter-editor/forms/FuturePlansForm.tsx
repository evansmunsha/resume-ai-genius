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

  return (
    <div className="mx-auto max-w-xl space-y-6">
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