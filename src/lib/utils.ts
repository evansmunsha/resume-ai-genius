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
    selectedTemplate: data.selectedTemplate || "startup",
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
    languages: data.languages,
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
  title = '🚀 AI-Powered Resume & Cover Letter Builder | Resume AI Genius',
  description = 'Create stunning resumes & cover letters in minutes with AI. Professional templates, instant customization, ATS-friendly. Join thousands of successful job seekers today!',
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
          width: 1200,
          height: 630,
          alt: 'Resume AI Genius - Smart Resume Builder',
        },
      ],
      siteName: 'Resume AI Genius',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@evansensteen',
      site: '@resumeaigenius',
    },
    icons,
    keywords: [
      'resume builder',
      'AI resume',
      'cover letter generator',
      'job application',
      'career tools',
      'professional resume',
      'ATS-friendly resume',
      'CV maker',
    ],
    authors: [{ name: 'Resume AI Genius Team' }],
    metadataBase: new URL('https://resume-ai-genius.vercel.app'),
    alternates: {
      canonical: 'https://resume-ai-genius.vercel.app',
    },
    verification: {
      google: 'your-google-verification-code',
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}