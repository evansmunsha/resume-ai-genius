
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types/types";
import { yourPersonalInfoSchema, YourPersonalInfoValues } from "@/lib/validation"; // Updated import
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function PersonalInfoForm({
    coverLetterData,
    setCoverLetterData,
  }: EditorFormProps) {
  const form = useForm<YourPersonalInfoValues>({ // Updated type
    resolver: zodResolver(yourPersonalInfoSchema), // Updated schema
    defaultValues: {
      firstName: coverLetterData.firstName || "",
      lastName: coverLetterData.lastName ||  "",
      jobTitle: coverLetterData.jobTitle ||  "",
      city: coverLetterData.city || "",
      country: coverLetterData.country ||  "",
      phone: coverLetterData.phone || "",
      email: coverLetterData.email ||  "",
      applicationLink: coverLetterData.applicationLink || "", // Added applicationLink
    },
  });

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
        <h2 className="text-2xl font-semibold">Personal info</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself.</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => field.onChange(e.target.value)} autoFocus/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => field.onChange(e.target.value)} autoFocus/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <FormControl>
                  <Input {...field} onChange={(e) => field.onChange(e.target.value)} autoFocus/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => field.onChange(e.target.value)} autoFocus/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => field.onChange(e.target.value)} autoFocus/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="applicationLink"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Linkedin Profile</FormLabel>
                    <FormControl>
                    <Input {...field} type="url"  placeholder="https://www.linkedin.com/in/evans-munsha-60785a230/"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}