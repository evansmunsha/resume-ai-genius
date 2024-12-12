"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { coverLetterSchema, CoverLetterValues } from "@/lib/validation";
import { del, put } from "@vercel/blob";
import path from "path";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canCreateCoverLetter, canUseCustomizations } from "@/lib/permissions";

export async function saveCoverLetter(values: CoverLetterValues) {
  const { id } = values;
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  // Check subscription and cover letter count if creating new
  if (!id) {
    const coverLetterCount = await prisma.coverLetter.count({ where: { userId } });
    if (!canCreateCoverLetter(subscriptionLevel, coverLetterCount)) {
      throw new Error("Maximum cover letter count reached for this subscription level");
    }
  }

  const {
    photo, coverLetterWorkExperience, jobDescription, recipientName, ...coverLetterValues
  } = coverLetterSchema.parse(values);

  const existingCoverLetter = id
    ? await prisma.coverLetter.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingCoverLetter) {
    throw new Error("Cover letter not found");
  }

  // Only check customizations if they're actually being changed
  const hasCustomizations = (
    (coverLetterValues.borderStyle && existingCoverLetter && 
     coverLetterValues.borderStyle !== existingCoverLetter.borderStyle) ||
    (coverLetterValues.colorHex && existingCoverLetter && 
     coverLetterValues.colorHex !== existingCoverLetter.colorHex)
  );

  if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level");
  }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingCoverLetter?.photoUrl) {
      await del(existingCoverLetter.photoUrl);
    }

    const blob = await put(`cover_letter_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingCoverLetter?.photoUrl) {
      await del(existingCoverLetter.photoUrl);
    }
    newPhotoUrl = null;
  }

  if (id) {
    return prisma.coverLetter.update({
      where: { id },
      data: {
        ...coverLetterValues,
        photoUrl: newPhotoUrl,
        template: values.template,
        font: values.font,
        colorHex: values.colorHex,
        borderStyle: values.borderStyle,
        achievements: "",
        opening: coverLetterValues.opening,
        experience: coverLetterValues.experience,
        companyKnowledge: coverLetterValues.companyKnowledge,
        futurePlans: coverLetterValues.futurePlans,
        closing: coverLetterValues.closing,
        Achievement: {
          deleteMany: {},
          create: coverLetterValues.achievements?.map(achievement => ({
            description: achievement.description,
            impact: achievement.impact,
            date: new Date(achievement.date)
          })) || []
        },
        coverLetterWorkExperience: {
          deleteMany: {},
          create: coverLetterWorkExperience?.map(exp => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          }))
        },
        jobDescription: {
          deleteMany: {},
          create: jobDescription?.map(exp => ({
            ...exp,
            
          }))
        },
        recipientInfo: {
          deleteMany: {},
          create: recipientName?.map(recipient => ({
            recipientName: recipient.recipientName || "",
            recipientTitle: recipient.recipientTitle || "",
            companyName: recipient.companyName || "",
            jobTitle: recipient.jobTitle || "",
            jobReference: recipient.jobReference
          })) || []
        },
        updatedAt: new Date(),

      },
    });
    
  }else {
    return prisma.coverLetter.create({
      data: {
        ...coverLetterValues,
        userId,
        photoUrl: newPhotoUrl,
        template: values.template,
        font: values.font,
        colorHex: values.colorHex,
        borderStyle: values.borderStyle,
        achievements: "",
        opening: "",
        experience: "",
        companyKnowledge: "",
        futurePlans: "",
        closing: "",
        Achievement: {
          create: coverLetterValues.achievements?.map(achievement => ({
            description: achievement.description,
            impact: achievement.impact,
            date: new Date(achievement.date)
          })) || []
        },
        coverLetterWorkExperience: {
          create: coverLetterWorkExperience?.map(exp => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          }))
        },
        jobDescription: {
          create: jobDescription?.map(exp => ({
            ...exp,
            
          }))
        },
        recipientInfo: {
          create: recipientName?.map(recipient => ({
            recipientName: recipient.recipientName || "",
            recipientTitle: recipient.recipientTitle || "",
            companyName: recipient.companyName || "",
            jobTitle: recipient.jobTitle || "",
            jobReference: recipient.jobReference
          })) || []
        },
      },
    });
  }

 
}
