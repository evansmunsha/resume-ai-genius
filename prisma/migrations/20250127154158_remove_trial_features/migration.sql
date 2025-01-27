/*
  Warnings:

  - You are about to drop the column `discountUsedAt` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `enterpriseTrialEnd` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `enterpriseTrialExpired` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `enterpriseTrialStart` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `proTrialEnd` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `proTrialExpired` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `proTrialStart` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripeDiscountApplied` on the `user_subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_subscriptions" DROP COLUMN "discountUsedAt",
DROP COLUMN "enterpriseTrialEnd",
DROP COLUMN "enterpriseTrialExpired",
DROP COLUMN "enterpriseTrialStart",
DROP COLUMN "proTrialEnd",
DROP COLUMN "proTrialExpired",
DROP COLUMN "proTrialStart",
DROP COLUMN "stripeDiscountApplied";

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "issuer" TEXT,
    "dateObtained" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "description" TEXT,
    "url" TEXT,
    "resumeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
