import prisma from "@/lib/prisma";
import { coverLetterDataInclude } from "@/lib/types/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import CoverLetterEditor from "./CoverLetterEditor";

interface PageProps {
  searchParams: Promise<{ coverLetterId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your cover letter",
};

export default async function Page({ searchParams }: PageProps) {
  const { coverLetterId } = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const coverLetterToEdit = coverLetterId
    ? await prisma.coverLetter.findUnique({
        where: { id: coverLetterId, userId },
        include: {
          ...coverLetterDataInclude,
        },
      })
    : null;

  return <CoverLetterEditor coverLetterToEdit={coverLetterToEdit} />;
}