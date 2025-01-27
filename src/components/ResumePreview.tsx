
import { ResumeValues } from "@/lib/validation";
import { TemplateId, templates } from "./templates";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

const ResumePreview = ({ resumeData, contentRef, className }: ResumePreviewProps) => {
  const templateId = (resumeData.selectedTemplate || "modern") as TemplateId;
  const Template = templates[templateId].component;
  return <Template resumeData={resumeData} contentRef={contentRef} className={className} />;
};

export default ResumePreview;
