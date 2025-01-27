import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function MinimalTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-gray-800",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("flex flex-col", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact"
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        <main className="p-8 space-y-6 print:break-inside-avoid">
          <HeaderSection resumeData={resumeData} />
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
        </main>
      </div>
    </div>
  );
}

function HeaderSection({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <header className="flex items-center space-x-4">
      {photoSrc && (
        <div className="flex-shrink-0">
          <Image
            src={photoSrc || "/placeholder.svg?height=100&width=100"}
            width={100}
            height={100}
            alt="Profile"
            className="object-cover"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "8px",
            }}
          />
        </div>
      )}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">
          {firstName} {lastName}
        </h1>
        <p className="text-lg text-gray-600">{jobTitle}</p>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          {[city, country].filter(Boolean).length > 0 && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{[city, country].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span>{email}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <section>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </section>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Work Experience

      <Separator className="bg-gray-200" />
      </h2>
      {workExperiences.map((exp, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium text-gray-800">{exp.position}</h3>
            <p className="text-sm text-gray-500">
              {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
              {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
            </p>
          </div>
          <p className="text-gray-600">{exp.company}</p>
          {exp.description && (
            <p className="text-sm text-gray-700">{exp.description}</p>
          )}
        </div>
      ))}
    </section>
  );
}

function EducationSection({ resumeData }: SectionProps) {
  const { educations } = resumeData;

  if (!educations?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Education

      <Separator className="bg-gray-200" />
      </h2>
      {educations.map((edu, index) => (
        <div key={index} className="flex justify-between items-baseline">
          <div>
            <h3 className="font-medium text-gray-800">{edu.degree}</h3>
            <p className="text-gray-600">{edu.school}</p>
          </div>
          <p className="text-sm text-gray-500">
            {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
            {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
          </p>
        </div>
      ))}
    </section>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Skills

      <Separator className="bg-gray-200" />
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

