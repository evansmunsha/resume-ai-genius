import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CoverLetterServerData } from "./types/types";
import { ResumeValues, CoverLetterValues } from "./validation";
import { ResumeServerData } from "./types";
import { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description || undefined,
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  };
}

export function mapToCoverLetterValues(data: CoverLetterServerData): CoverLetterValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    applicationLink: data.applicationLink || undefined,
    recipientName: data.recipientInfo.map(info => ({
      recipientName: info.recipientName || "",
      recipientTitle: info.recipientTitle || "",
      companyName: info.companyName || "",
      jobTitle: info.jobTitle || "",
      jobReference: info.jobReference || undefined,
    })),
    jobDescription: data.jobDescription.map(job => ({
      title: job.title,
      companyName: job.companyName,
      location: job.location || undefined,
      employmentType: job.employmentType || undefined,
      salaryRange: job.salaryRange || undefined,
      responsibilities: job.responsibilities,
      qualifications: job.qualifications,
    })),
    coverLetterWorkExperience: data.coverLetterWorkExperience.map(exp => ({
      description: exp.description || undefined,
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split('T')[0],
      endDate: exp.endDate?.toISOString().split('T')[0],
    })),
    achievements: data.Achievement.map(ach => ({
      description: ach.description,
      impact: ach.impact,
      date: ach.date.toISOString().split('T')[0],
    })),
    opening: data.opening || "",
    experience: data.experience || "",
    companyKnowledge: data.companyKnowledge || "",
    futurePlans: data.futurePlans || "",
    closing: data.closing || "",
    colorHex: data.colorHex,
    borderStyle: data.borderStyle,
    skills: data.skills || [],
  };
}



export function constructMetadata({
  title = 'Build Your Dream Resume & Cover Letter in Just Minutes',
  description = 'Resume AI Genius is the easiest way to create a professional resume that will help you land your dream job. plus a Cover Letter.',
  image = '/opengraph-image.jpeg',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@evansensteen',
    },
    icons,
    metadataBase: new URL('https://resume-ai-genius.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}