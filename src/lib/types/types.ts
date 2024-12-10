import { Prisma } from "@prisma/client";
import { CoverLetterValues } from "../validation";

export interface EditorFormProps {
  coverLetterData: CoverLetterValues;
  setCoverLetterData: (data: CoverLetterValues) => void;
}

export const coverLetterDataInclude = {
  recipientInfo: true,
  jobDescription: true,
  coverLetterWorkExperience: true,
  Achievement: true,
} satisfies Prisma.CoverLetterInclude;

export type CoverLetterServerData = Prisma.CoverLetterGetPayload<{
  include: typeof coverLetterDataInclude;
}>;

