import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export default function MinimalistTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
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
        <main className="p-8 space-y-6 print:break-inside-avoid font-sans">
          <HeaderSection resumeData={resumeData} />
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
          {/* <CertificationsSection resumeData={resumeData} /> */}
          <LanguagesSection resumeData={resumeData} />
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
    <header className="flex items-center space-x-6">
      {photoSrc && (
        <div className="flex-shrink-0">
          <Image
            src={photoSrc || "/placeholder.svg?height=120&width=120"}
            width={120}
            height={120}
            alt="Profile"
            className="object-cover"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "8px",
            }}
          />
        </div>
      )}
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-wide uppercase">
          {firstName} {lastName}
        </h1>
        <p className="text-lg text-gray-600">{jobTitle}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {[city, country].filter(Boolean).length > 0 && (
            <span>{[city, country].filter(Boolean).join(", ")}</span>
          )}
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
        </div>
      </div>
    </header>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold uppercase tracking-wide">Summary</h2>
      <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
    </section>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold uppercase tracking-wide">Experience</h2>
      <div className="space-y-4">
        {workExperiences.map((exp, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <h3 className="font-medium">{exp.position}</h3>
              <span className="text-sm text-gray-500">
                {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
              </span>
            </div>
            <p className="text-sm text-gray-600">{exp.company}</p>
            {exp.description && (
              <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ resumeData }: SectionProps) {
  const { educations } = resumeData;

  if (!educations?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold uppercase tracking-wide">Education</h2>
      <div className="space-y-2">
        {educations.map((edu, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <h3 className="font-medium">{edu.degree}</h3>
              <span className="text-sm text-gray-500">
                {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
                {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
              </span>
            </div>
            <p className="text-sm text-gray-600">{edu.school}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold uppercase tracking-wide">Skills</h2>
      <p className="text-sm text-gray-700">{skills.join(" • ")}</p>
    </section>
  );
}

/* function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications } = resumeData;

  if (!certifications?.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold uppercase tracking-wide">Certifications</h2>
      <div className="space-y-1">
        {certifications.map((cert, index) => (
          <div key={index} className="text-sm">
            <span className="font-medium">{cert.name}</span> - {cert.issuer}
            {cert.dateObtained && (
              <span className="text-gray-500">
                {" "}
                ({formatDate(new Date(cert.dateObtained), "MMM yyyy")})
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} */

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages } = resumeData;

  if (!languages?.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold uppercase tracking-wide">Languages</h2>
      <p className="text-sm text-gray-700">
        {languages.map(lang => `${lang} (${lang})`).join(" • ")}
      </p>
    </section>
  );
}

