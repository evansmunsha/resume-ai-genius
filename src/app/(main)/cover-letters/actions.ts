"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteCoverLetter(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const coverLetter = await prisma.coverLetter.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!coverLetter) {
    throw new Error("Cover letter not found");
  }

  // Delete the cover letter from the database
  await prisma.coverLetter.delete({
    where: {
      id,
    },
  });

  // Revalidate the path to ensure the UI reflects the deletion
  revalidatePath("/coverletters");
}
