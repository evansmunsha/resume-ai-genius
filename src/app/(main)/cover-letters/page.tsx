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

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getCoverLetters(userId: string, page: number) {
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  return Promise.all([
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
}

export default async function CoverLettersPage({ searchParams }: PageProps) {
  const { userId } = await auth();
  if (!userId) return null;

  // Parse page number
  const pageStr = searchParams?.page;
  const pageNumber = pageStr ? parseInt(String(pageStr)) : 1;

  const [coverLetters, totalCount, subscriptionLevel] = await getCoverLetters(
    userId,
    pageNumber
  );

  const totalPages = Math.ceil(totalCount / 12);

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
          <CoverLetterItem 
            key={coverLetter.id} 
            coverLetter={coverLetter} 
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`/cover-letters?page=${i + 1}`}
              className={cn(
                "px-4 py-2 border rounded transition-colors",
                pageNumber === i + 1 && "bg-primary text-primary-foreground"
              )}
            >
              {i + 1}
            </Link>
          ))}
        </nav>
      )}
    </main>
  );
} 