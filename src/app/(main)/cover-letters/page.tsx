import { canCreateCoverLetter } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { coverLetterDataInclude } from "@/lib/types/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CreateCoverLetterButton from "./CreateCoverLetterButton";
import CoverLetterItem from "./CoverLetterItem";

export const metadata: Metadata = {
  title: "Your cover letters",
};

interface SearchParams {
  page?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const currentPage = Number(searchParams?.page || "1");
  const pageSize = 12;
  const skip = (currentPage - 1) * pageSize;

  const [coverLetters, totalCount, subscriptionLevel] = await Promise.all([
    prisma.coverLetter.findMany({
      where: { userId },
      include: coverLetterDataInclude,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.coverLetter.count({ where: { userId } }),
    getUserSubscriptionLevel(userId),
  ]);

  
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-3 py-6">
      <CreateCoverLetterButton
        canCreate={canCreateCoverLetter(subscriptionLevel, totalCount)}
      />
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your cover letters</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {coverLetters.map((coverLetter) => (
          <CoverLetterItem key={coverLetter.id} coverLetter={coverLetter} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`/cover-letters?page=${i + 1}`}
              className={cn(
                "px-4 py-2 border rounded",
                currentPage === i + 1 && "bg-primary text-primary-foreground"
              )}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
} 