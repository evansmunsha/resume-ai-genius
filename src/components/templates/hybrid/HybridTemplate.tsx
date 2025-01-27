import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone, Globe, Briefcase, GraduationCap,  Target, Zap, CheckCircle2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function HybridTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
              <CoreCompetenciesSection resumeData={resumeData} />
              <ExperienceSection resumeData={resumeData} />
            </div>
            <div className="space-y-6">
              <SkillsSection resumeData={resumeData} />
              <EducationSection resumeData={resumeData} />
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

function CoreCompetenciesSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  const coreCompetencies = skills.slice(0, 6); // Display top 6 skills as core competencies

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <CheckCircle2 size={20} />
        Core Competencies
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {coreCompetencies.map((skill, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colorHex }}></div>
            <span>{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Briefcase size={20} />
        Professional Experience
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

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Zap size={20} />
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

/* export default function Component() {
  const mockResumeData: ResumeValues = {
    firstName: "Alex",
    lastName: "Johnson",
    jobTitle: "Marketing Manager & Content Strategist",
    photo: "/placeholder.svg?height=120&width=120",
    city: "New York",
    country: "NY",
    phone: "(555) 123-4567",
    email: "alex.johnson@example.com",
    colorHex: "#2563eb",
    borderStyle: BorderStyles.ROUNDED,
    summary: "Dynamic marketing professional with 7+ years of experience in digital marketing and content strategy. Proven track record of developing and executing successful marketing campaigns that drive engagement and conversions. Skilled in SEO, social media marketing, and data-driven decision making.",
    skills: [
      "Digital Marketing",
      "Content Strategy",
      "SEO/SEM",
      "Social Media Management",
      "Data Analytics",
      "Email Marketing",
      "Brand Development",
      "Project Management",
      "Adobe Creative Suite",
      "Google Analytics",
      "Marketing Automation",
      "CRM Systems"
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "Spanish", level: "Professional" },
      { name: "French", level: "Conversational" }
    ],
    educations: [
      {
        degree: "Master of Science in Marketing",
        school: "New York University",
        startDate: "2013-09-01",
        endDate: "2015-05-31"
      },
      {
        degree: "Bachelor of Arts in Communications",
        school: "University of California, Berkeley",
        startDate: "2009-09-01",
        endDate: "2013-05-31"
      }
    ],
    workExperiences: [
      {
        position: "Senior Marketing Manager",
        company: "TechStart Solutions",
        startDate: "2019-03-01",
        endDate: null,
        description: "Lead a team of 8 marketing professionals in developing and executing multi-channel marketing strategies. Increased website traffic by 150% and improved conversion rates by 40% through data-driven optimization."
      },
      {
        position: "Content Marketing Specialist",
        company: "Global Media Group",
        startDate: "2015-06-01",
        endDate: "2019-02-28",
        description: "Developed and implemented content strategies across various platforms, resulting in a 200% increase in organic search traffic. Managed a team of freelance writers and designers to produce high-quality content."
      },
      {
        position: "Digital Marketing Coordinator",
        company: "Innovative Brands Inc.",
        startDate: "2013-07-01",
        endDate: "2015-05-31",
        description: "Assisted in the planning and execution of digital marketing campaigns. Conducted market research and competitor analysis to inform marketing strategies."
      }
    ],
    certifications: [
      {
        name: "Google Analytics Individual Qualification",
        issuer: "Google",
        dateObtained: "2022-04-15"
      },
      {
        name: "HubSpot Inbound Marketing Certification",
        issuer: "HubSpot Academy",
        dateObtained: "2021-09-30"
      },
      {
        name: "Facebook Blueprint Certification",
        issuer: "Facebook",
        dateObtained: "2020-11-12"
      }
    ]
  };

  return (
    <HybridTemplate resumeData={mockResumeData} />
  );
} */