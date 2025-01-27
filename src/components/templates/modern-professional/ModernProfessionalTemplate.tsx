import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone, Globe, Briefcase, GraduationCap, User2, Target, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function ModernProfessionalTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
        <div className="grid grid-cols-[280px_1fr] min-h-full print:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside 
            className="p-6 print:break-inside-avoid"
            style={{ backgroundColor: `${resumeData.colorHex}10` }}
          >
            <div className="sticky top-6 space-y-6">
              <ProfileSection resumeData={resumeData} />
              <ContactSection resumeData={resumeData} />
              <SkillsSection resumeData={resumeData} />
              <LanguagesSection resumeData={resumeData} />
              {/* <CertificationsSection resumeData={resumeData} /> */}
            </div>
          </aside>

          {/* Main Content */}
          <main className="p-6 space-y-6 print:break-inside-avoid">
            <HeaderSection resumeData={resumeData} />
            <SummarySection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="text-center space-y-3">
      {photoSrc && (
        <div className="mx-auto w-32 h-32 relative">
          <Image
            src={photoSrc || "/placeholder.svg?height=128&width=128"}
            width={128}
            height={128}
            alt="Profile"
            className="object-cover mx-auto"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "8px",
            }}
          />
        </div>
      )}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">
          {firstName} {lastName}
        </h1>
        <p className="text-sm text-muted-foreground">{jobTitle}</p>
      </div>
    </div>
  );
}

function HeaderSection({ resumeData }: SectionProps) {
  const { firstName, lastName, jobTitle } = resumeData;
  
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        {firstName} {lastName}
      </h1>
      <p className="text-xl text-muted-foreground">{jobTitle}</p>
    </div>
  );
}

function ContactSection({ resumeData }: SectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  if (!email?.length || !phone?.length || !city?.length || !country?.length) return null;

  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 font-semibold" style={{ color: colorHex }}>
        <User2 size={18} />
        Contact Details
      </h2>
      <div className="space-y-2 text-sm">
        {[city, country].filter(Boolean).length > 0 && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-muted-foreground" />
            <span>{[city, country].filter(Boolean).join(", ")}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-muted-foreground" />
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-muted-foreground" />
            <span className="break-all">{email}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 font-semibold" style={{ color: colorHex }}>
        <Target size={18} />
        Professional Summary
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
    </div>
  );
}

function ExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 font-semibold" style={{ color: colorHex }}>
        <Briefcase size={18} />
        Work Experience
      </h2>
      <div className="space-y-4">
        {workExperiences.map((exp, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{exp.position}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${colorHex}15`,
                  color: colorHex
                }}
              >
                {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
              </span>
            </div>
            {exp.description && (
              <p className="text-sm text-muted-foreground">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ resumeData }: SectionProps) {
  const { educations, colorHex } = resumeData;

  if (!educations?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 font-semibold" style={{ color: colorHex }}>
        <GraduationCap size={18} />
        Education
      </h2>
      <div className="space-y-4">
        {educations.map((edu, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">{edu.school}</p>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${colorHex}15`,
                  color: colorHex
                }}
              >
                {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
                {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 font-semibold" style={{ color: colorHex }}>
        <Zap size={18} />
        Skills
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <Badge 
            key={index}
            variant="outline"
            className="rounded-full"
            style={{
              backgroundColor: `${colorHex}08`,
              borderColor: `${colorHex}30`,
            }}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages, colorHex } = resumeData;

  if (!languages?.length) return null;

  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 font-semibold" style={{ color: colorHex }}>
        <Globe size={18} />
        Languages
      </h2>
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center text-sm"
          >
            <span>{lang}</span>
            <Badge
              variant="outline"
              className="rounded-full"
              style={{
                backgroundColor: `${colorHex}08`,
                borderColor: `${colorHex}30`,
              }}
            >
              {lang}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
