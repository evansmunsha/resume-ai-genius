/* eslint-disable @typescript-eslint/no-explicit-any */
import { canCreateResume } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Your resumes",
};

export default async function ResumesPage(props: any) {
  const { userId } = await auth();
  if (!userId) return null;

  const pageStr = props?.searchParams?.page;
  const pageNumber = pageStr ? parseInt(String(pageStr)) : 1;

  const [resumes, totalCount, subscriptionLevel] = await getResumes(
    userId,
    pageNumber
  );

  const totalPages = Math.ceil(totalCount / 12);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-3 px-3 py-3">
      <CreateResumeButton
        canCreate={canCreateResume(subscriptionLevel, totalCount)}
      />
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your resumes</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`/resumes?page=${i + 1}`}
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
          <div className='h-fit mt-8'>
            <AdBanner 
              dataAdSlot={"2115087201"} 
              dataAdFormat={"auto"} 
              dataFullWidthResponsive={true} 
            />
          </div>
    </main>
  );
}

async function getResumes(userId: string, page: number) {
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  return Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: resumeDataInclude,
      take: pageSize,
      skip,
    }),
    prisma.resume.count({
      where: { userId },
    }),
    getUserSubscriptionLevel(userId),
  ]);
}
