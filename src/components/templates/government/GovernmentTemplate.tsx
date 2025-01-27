import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { format, formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPinHouse, Phone } from "lucide-react";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function GovernmentTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn(" p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        {/* Header */}
        <div className="border-b-2 mb-2" style={{ borderColor: resumeData.colorHex }}>
          <div className="px-8 py-6">
            <PersonalInfoHeader resumeData={resumeData} />
          </div>
        </div>

        {/* Main Content */}
        <div className=" grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-6">
            <SummarySection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
          <div className="space-y-6">
            <SkillsSection resumeData={resumeData} />{/* 
            <CertificationsSection resumeData={resumeData} />
            <AwardsSection resumeData={resumeData} /> */}
            <ContactSection resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoHeader({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, colorHex, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={120}
          height={120}
          alt="Profile"
          className="aspect-square object-cover"
          style={{
            borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                        borderStyle === BorderStyles.CIRCLE ? "9999px" : "4px",
            borderColor: colorHex,
            borderWidth: "2px"
          }}
        />
      )}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-semibold" style={{ color: colorHex }}>
          {firstName} {lastName}
        </h1>
        <p className="text-lg mt-1 text-gray-600">{jobTitle}</p>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <Card>
      <CardContent className="p-3">
      <h2 className="text-l text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: colorHex }}>
        Professional Summary
      </h2>
        <p className="text-xs text-gray-600 leading-tight">{summary}</p>
      </CardContent>
    </Card>
  );
}

function ExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
      <h2 className="text-base font-semibold uppercase tracking-wide" style={{ color: colorHex }}>
        Experience
      </h2>
      <div className="space-y-5">
        {workExperiences.map((exp, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-medium" style={{ color: colorHex }}>
                  {exp.position}
                </h3>
                <p className="text-sm text-gray-600">{exp.company}</p>
              </div>
              {exp.startDate && (
                <p className="text-sm text-gray-500">
                  {format(new Date(exp.startDate), "MM/yyyy")} - {exp.endDate ? format(new Date(exp.endDate), "MM/yyyy") : "Present"}
                </p>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">{exp.description}</p>
          </div>
        ))}
      </div>
    </CardContent>
    </Card>
  );
}

function EducationSection({ resumeData }: SectionProps) {
  const { colorHex, educations } = resumeData;

  if (!educations?.length) return null;

  return (
    
      <Card>
      <CardContent className="p-3 space-y-3">

      
    
        <h2 className="text-base font-semibold uppercase tracking-wide" style={{ color: colorHex }}>
          Education
        </h2>
        <ul className="space-y-2 text-sm text-gray-600">
          {educations.map((edu, index) => (
            <li key={index}>
              <p>
                <strong>{edu.degree}</strong> - {edu.school}
              </p>
              {edu.startDate && (
              <p className="text-sm text-gray-500">
                {formatDate(edu.startDate, "yyyy")} - {edu.endDate ? formatDate(edu.endDate, "yyyy") : "Present"}
              </p>
            )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
    
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex,borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    
    <Card>
    <CardContent className="p-3 space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: colorHex }}>Skills</h2>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill, index) => (
          <Badge key={index}  className={colorHex === "text-xs text-white" ? colorHex : " bg-white border-neutral-950"} style={{
            borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                        borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
                        color: colorHex
          }}>
            • {skill}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
    
  );
}

/* function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications, colorHex } = resumeData;

  if (!certifications?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold uppercase tracking-wide" style={{ color: colorHex }}>
        Certifications
      </h2>
      <ul className="space-y-2 text-sm text-gray-600">
        {certifications.map((cert, index) => (
          <li key={index}>{cert}</li>
        ))}
      </ul>
    </div>
  );
} */

/* function AwardsSection({ resumeData }: SectionProps) {
  const { awards, colorHex } = resumeData;

  if (!awards?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold uppercase tracking-wide" style={{ color: colorHex }}>
        Awards & Recognitions
      </h2>
      <ul className="space-y-2 text-sm text-gray-600">
        {awards.map((award, index) => (
          <li key={index}>{award}</li>
        ))}
      </ul>
    </div>
  );
} */

function ContactSection({ resumeData }: SectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  if (!email?.length || !phone?.length || !city?.length || !country?.length) return null;

  return (
    
    <Card>
      <CardContent className="p-3 space-y-3">
        <h2 className="text-base font-semibold uppercase tracking-wide" style={{ color: colorHex }}>
          Contact Information
        </h2>
        <div className="space-y-2 text-sm">
          {phone && <p className="flex items-center gap-1"><Phone size={15}/>{phone}</p>}
          {email && <p className="flex items-center gap-1"><Mail size={15}/>{email}</p>}
          {[city, country].filter(Boolean).length > 0 && (
            <p className="flex items-center gap-1"><MapPinHouse  size={15}/>{[city, country].filter(Boolean).join(", ")}</p>
          )}
        </div>
      </CardContent>
    </Card>
    
  );
}
