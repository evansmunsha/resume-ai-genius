import { GenerateYourInfoValues, generateYourInfoSchema } from "@/lib/validation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { EditorFormProps } from "@/lib/types/types";

export default function YourInfoForm({
    coverLetterData,
    setCoverLetterData
  }: EditorFormProps) {

    const form = useForm<GenerateYourInfoValues>({
        resolver: zodResolver(generateYourInfoSchema),
        defaultValues: {
            title: coverLetterData.title||"",
            description: coverLetterData.description||""
        }
    })

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
          const isValid = await form.trigger();
          if (!isValid) return;
          setCoverLetterData({...coverLetterData, ...values})
        });
        return unsubscribe;
      }, [form, coverLetterData, setCoverLetterData,]);
    
    return (
        <div className="mx-auto max-w-xl space-y-6">
          <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold">General info</h2>
            <p className="text-sm text-muted-foreground">
              This will not appear on your Cover Letter.
            </p>
          </div>
          <Form {...form}>
            <form className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="My cool cover letter" autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="A cover letter for my next job" />
                    </FormControl>
                    <FormDescription>
                      Describe what this cover letter is for.
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


