import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone, Globe, Briefcase, GraduationCap, Star, Clock, Target, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function MidCareerProfessionalTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
        <header className="p-6 print:break-inside-avoid" style={{ backgroundColor: resumeData.colorHex }}>
          <HeaderSection resumeData={resumeData} />
        </header>
        <main className="p-6 space-y-6 print:break-inside-avoid">
          <div className="grid grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-6">
              <SummarySection resumeData={resumeData} />
              <WorkExperienceSection resumeData={resumeData} />
              <EducationSection resumeData={resumeData} />
            </div>
            <div className="space-y-6">
              <KeyAchievementsSection resumeData={resumeData} />
              <SkillsSection resumeData={resumeData} />
              {/* <CertificationsSection resumeData={resumeData} /> */}
              <LanguagesSection resumeData={resumeData} />
            </div>
          </div>
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
    <div className="flex items-center gap-6 text-white">
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
      <div className="flex-grow space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {firstName} {lastName}
        </h1>
        <p className="text-xl">{jobTitle}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {[city, country].filter(Boolean).length > 0 && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{[city, country].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>{email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Target size={20} />
        Professional Summary
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
    </div>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Briefcase size={20} />
        Professional Experience
      </h2>
      <div className="space-y-6">
        {workExperiences.map((exp, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{exp.position}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{ 
                  backgroundColor: `${colorHex}15`,
                  color: colorHex
                }}
              >
                <Clock size={12} />
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

function KeyAchievementsSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  if (!workExperiences?.length) return null;

  // Extract achievements from work experiences
  const achievements = workExperiences.flatMap(exp => 
    exp.description ? exp.description.split('. ').filter(s => s.trim().length > 0) : []
  ).slice(0, 5); // Limit to top 5 achievements

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Star size={20} />
        Key Achievements
      </h2>
      <ul className="list-disc list-inside space-y-2">
        {achievements.map((achievement, index) => (
          <li key={index} className="text-sm text-muted-foreground">{achievement}</li>
        ))}
      </ul>
    </div>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  // For demonstration, we'll assign random proficiency levels to skills
  const skillsWithProficiency = skills.map(skill => ({
    name: skill,
    proficiency: Math.floor(Math.random() * 31) + 70 // Random number between 70 and 100
  }));

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Zap size={20} />
        Skills
      </h2>
      <div className="space-y-2">
        {skillsWithProficiency.map((skill, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span>{skill.name}</span>
              <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
            </div>
            <Progress value={skill.proficiency} className="h-1.5"  />
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
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <GraduationCap size={20} />
        Education
      </h2>
      <div className="space-y-2">
        {educations.map((edu, index) => (
          <div key={index} className="space-y-1">
            <h3 className="font-medium">{edu.degree}</h3>
            <p className="text-sm text-muted-foreground">{edu.school}</p>
            <p className="text-xs text-muted-foreground">
              {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
              {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications, colorHex } = resumeData;

  if (!certifications?.length) return null;

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Award size={20} />
        Certifications
      </h2>
      <div className="space-y-2">
        {certifications.map((cert, index) => (
          <div key={index} className="space-y-1">
            <p className="text-sm font-medium">{cert.name}</p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{cert.issuer}</span>
              {cert.dateObtained && (
                <span>{formatDate(new Date(cert.dateObtained), "MMM yyyy")}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} */

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages, colorHex } = resumeData;

  if (!languages?.length) return null;

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Globe size={20} />
        Languages
      </h2>
      <div className="space-y-1">
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