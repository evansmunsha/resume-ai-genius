import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

 
export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number];

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export type SkillsValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryValues = z.infer<typeof summarySchema>;




export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...summarySchema.shape,
  ...skillsSchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
};


export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;





//for coverletter 

export const generateYourInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GenerateYourInfoValues = z.infer<typeof generateYourInfoSchema>;


export const yourPersonalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
  applicationLink: optionalString,
});

export type YourPersonalInfoValues = z.infer<typeof yourPersonalInfoSchema>;


// Recipient Info Schema



export const coverLetterWorkExperienceSchema = z.object({
  coverLetterWorkExperience: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      })
    )
    .optional(),
});

export type CoverLetterWorkExperienceValues = z.infer<typeof coverLetterWorkExperienceSchema>;




export const recipientNameSchema = z.object({
  recipientName: z.array(
    z.object({
      recipientName: optionalString.refine((val) => val !== undefined, {
        message: "Recipient name is required",
      }),
      recipientTitle: optionalString.refine((val) => val !== undefined, {
        message: "Recipient title is required",
      }),
      companyName: optionalString.refine((val) => val !== undefined, {
        message: "Company name is required",
      }),
      jobTitle: optionalString.refine((val) => val !== undefined, {
        message: "Job title is required",
      }),
      jobReference: optionalString.optional(),
    })
  ),
});

export type RecipientNameValues = z.infer<typeof recipientNameSchema>;

export const jobDescriptionSchema = z.object({
  jobDescription: z.array(
    z.object({
      title: z.string().trim().min(1, "Job title is required"),
      companyName: z.string().trim().min(1, "Company name is required"),
      location: optionalString,
      employmentType: optionalString,
      salaryRange: optionalString,
      responsibilities: z.array(z.string()).optional(),
      qualifications: z.array(z.string()).optional(),
    }),
  ).optional(),
});

export type JobDescriptionValues = z.infer<typeof jobDescriptionSchema>;


// Achievement validation schema without IDs
export const achievementSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  impact: z.string().trim().min(1, "Impact is required"),
  date: z.string()
    .min(1, "Date is required")
    .refine((date) => new Date(date) <= new Date(), {
      message: "Date must be in the past",
    }),
});

// Type inference for Achievement values
export type AchievementValues = z.infer<typeof achievementSchema>;


export const coverLetterSkillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export type CoverLetterSkillsValues = z.infer<typeof coverLetterSkillsSchema>;

export const coverLetterContentSchema = z.object({
  opening: z.string()
    .trim()
    .min(1, "Opening statement is required")
    .min(50, "Opening statement should be at least 50 characters")
    .optional()
    .or(z.literal("")),
  
  experience: z.string()
    .trim()
    .min(1, "Experience description is required")
    .min(100, "Experience description should be detailed")
    .optional()
    .or(z.literal("")),
  
  companyKnowledge: z.string()
    .trim()
    .min(1)
    .min(50)
    .optional()
    .or(z.literal("")),
    
  futurePlans: z.string()
    .trim()
    .min(1)
    .min(50)
    .optional()
    .or(z.literal("")),
    
  closing: z.string()
    .trim()
    .min(1)
    .min(30)
    .optional()
    .or(z.literal(""))
});

export type CoverLetterContentValues = z.infer<typeof coverLetterContentSchema>;

export const coverLetterSchema = z.object({
  ...generateYourInfoSchema.shape,
  ...yourPersonalInfoSchema.shape,
  ...coverLetterWorkExperienceSchema.shape,
  ...jobDescriptionSchema.shape,
  ...recipientNameSchema.shape,
  ...coverLetterSkillsSchema.shape,
  ...coverLetterContentSchema.shape,
  achievements: z.array(achievementSchema).optional(),
  colorHex: optionalString,
  borderStyle: optionalString,
});

export type CoverLetterValues = Omit<z.infer<typeof coverLetterSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
  title?: string;
  template?: string;
  font?: string;
};

export const generateExperienceSchema = z.object({
  experience: optionalString
});

export type GenerateExperienceInput = z.infer<typeof generateExperienceSchema>;

export const generateCompanyKnowledgeSchema = z.object({
  companyKnowledge: optionalString
});

export type GenerateCompanyKnowledgeInput = z.infer<typeof generateCompanyKnowledgeSchema>;

export const generateFuturePlansSchema = z.object({
  futurePlans: optionalString
});

export type GenerateFuturePlansInput = z.infer<typeof generateFuturePlansSchema>;

export const generateClosingSchema = z.object({
  closing: optionalString
});

export type GenerateClosingInput = z.infer<typeof generateClosingSchema>;

export const generateAchievementSchema = z.object({
  description: optionalString,
  impact: optionalString,
  date: optionalString
});

export type GenerateAchievementInput = z.infer<typeof generateAchievementSchema>;

export const generateOpeningSchema = z.object({
  jobTitle: optionalString,
  ...coverLetterContentSchema.shape,
  ...coverLetterSkillsSchema.shape,
  achievements: z.array(achievementSchema),
  
});

export type GenerateOpeningInput = z.infer<typeof generateOpeningSchema>;

