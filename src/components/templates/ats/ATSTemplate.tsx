import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Separator } from "@/components/ui/separator";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export default function ATSFriendlyTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
        <main className="p-6 space-y-4 print:break-inside-avoid">
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
    <header className="space-y-2">
      <div className="flex items-center space-x-4">
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
        <div>
          <h1 className="text-2xl font-bold uppercase">
            {firstName} {lastName}
          </h1>
          <p className="text-lg">{jobTitle}</p>
        </div>
      </div>
      <div className="text-sm">
        {[city, country].filter(Boolean).length > 0 && (
          <p>{[city, country].filter(Boolean).join(", ")}</p>
        )}
        {phone && <p>{phone}</p>}
        {email && <p>{email}</p>}
      </div>
      <Separator />
    </header>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold uppercase">Professional Summary</h2>
      <p className="text-sm">{summary}</p>
      <Separator />
    </section>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold uppercase">Work Experience</h2>
      <div className="space-y-4">
        {workExperiences.map((exp, index) => (
          <div key={index} className="space-y-1">
            <h3 className="font-medium">{exp.position}</h3>
            <p className="text-sm">{exp.company}</p>
            <p className="text-sm">
              {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
              {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
            </p>
            {exp.description && (
              <p className="text-sm">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
      <Separator />
    </section>
  );
}

function EducationSection({ resumeData }: SectionProps) {
  const { educations } = resumeData;

  if (!educations?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold uppercase">Education</h2>
      <div className="space-y-2">
        {educations.map((edu, index) => (
          <div key={index} className="space-y-1">
            <h3 className="font-medium">{edu.degree}</h3>
            <p className="text-sm">{edu.school}</p>
            <p className="text-sm">
              {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
              {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
            </p>
          </div>
        ))}
      </div>
      <Separator />
    </section>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold uppercase">Skills</h2>
      <p className="text-sm">{skills.join(", ")}</p>
      <Separator />
    </section>
  );
}

/* function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications } = resumeData;

  if (!certifications?.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold uppercase">Certifications</h2>
      <div className="space-y-1">
        {certifications.map((cert, index) => (
          <p key={index} className="text-sm">
            {cert.name}, {cert.issuer}
            {cert.dateObtained && (
              <span>
                {" "}
                ({formatDate(new Date(cert.dateObtained), "MMM yyyy")})
              </span>
            )}
          </p>
        ))}
      </div>
      <Separator />
    </section>
  );
}
 */
function LanguagesSection({ resumeData }: SectionProps) {
  const { languages } = resumeData;

  if (!languages?.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold uppercase">Languages</h2>
      <p className="text-sm">
        {languages.map(lang => `${lang} `).join(", ")}
      </p>
    </section>
  );
}

