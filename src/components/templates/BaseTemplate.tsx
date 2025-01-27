import { ResumeValues } from "@/lib/validation";

export interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export interface SectionProps {
  resumeData: ResumeValues;
  className?: string;
} 