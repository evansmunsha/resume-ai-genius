import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone, Globe, Briefcase, GraduationCap, Award, User2, Target, Zap, Star } from 'lucide-react';
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

export function FunctionalTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
              <ProfessionalAchievementsSection resumeData={resumeData} />
              <WorkExperienceSection resumeData={resumeData} />
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
        <Star size={20} />
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

function ProfessionalAchievementsSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  if (!workExperiences?.length) return null;

  // Extract achievements from work experiences
  const achievements = workExperiences.flatMap(exp => 
    exp.description ? exp.description.split('. ').filter(s => s.trim().length > 0) : []
  ).slice(0, 5); // Limit to top 5 achievements

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <Award size={20} />
        Professional Achievements
      </h2>
      <ul className="list-disc list-inside space-y-2">
        {achievements.map((achievement, index) => (
          <li key={index} className="text-sm text-muted-foreground">{achievement}</li>
        ))}
      </ul>
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
        Work Experience
      </h2>
      <div className="space-y-4">
        {workExperiences.map((exp, index) => (
          <div key={index} className="space-y-1">
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
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  // For demonstration, we'll assign random proficiency levels to skills
  const skillsWithProficiency = skills.map(skill => ({
    name: skill,
    proficiency: Math.floor(Math.random() * 50) + 70 // Random number between 60 and 100
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
            <Progress value={skill.proficiency} className="h-1.5" style={{ color: colorHex }} />
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

/* export default function Component() {
  const mockResumeData: ResumeValues = {
    firstName: "Taylor",
    lastName: "Morgan",
    jobTitle: "Project Manager & Business Analyst",
    photo: "/placeholder.svg?height=120&width=120",
    city: "Chicago",
    country: "IL",
    phone: "(555) 987-6543",
    email: "taylor.morgan@example.com",
    colorHex: "#0891b2",
    borderStyle: BorderStyles.ROUNDED,
    summary: "Versatile Project Manager and Business Analyst with 8+ years of experience in driving successful project outcomes and optimizing business processes. Skilled in translating complex business requirements into actionable plans, managing cross-functional teams, and delivering data-driven insights to support strategic decision-making.",
    skills: [
      "Project Management",
      "Business Analysis",
      "Agile Methodologies",
      "Stakeholder Management",
      "Process Improvement",
      "Data Analysis",
      "Risk Management",
      "Change Management",
      "Requirements Gathering",
      "Budgeting & Forecasting",
      "JIRA & Confluence",
      "Microsoft Office Suite"
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "Mandarin", level: "Professional" },
      { name: "German", level: "Conversational" }
    ],
    educations: [
      {
        degree: "Master of Business Administration (MBA)",
        school: "University of Chicago Booth School of Business",
        startDate: "2012-09-01",
        endDate: "2014-06-30"
      },
      {
        degree: "Bachelor of Science in Information Systems",
        school: "Northwestern University",
        startDate: "2008-09-01",
        endDate: "2012-05-31"
      }
    ],
    workExperiences: [
      {
        position: "Senior Project Manager",
        company: "TechInnovate Solutions",
        startDate: "2018-03-01",
        endDate: null,
        description: "Led cross-functional teams in the successful delivery of 10+ high-impact IT projects. Implemented Agile methodologies, resulting in a 30% reduction in project delivery time. Developed and maintained project budgets totaling over $5M annually."
      },
      {
        position: "Business Analyst",
        company: "Global Consulting Group",
        startDate: "2014-07-01",
        endDate: "2018-02-28",
        description: "Conducted in-depth analysis of business processes for Fortune 500 clients, identifying inefficiencies and proposing solutions that led to an average of 25% cost savings. Facilitated requirements gathering sessions and created detailed functional specifications for system implementations."
      },
      {
        position: "Junior Business Analyst",
        company: "StartUp Innovations Inc.",
        startDate: "2012-06-01",
        endDate: "2014-06-30",
        description: "Assisted in the development of business cases and cost-benefit analyses for new product initiatives. Collaborated with development teams to ensure alignment between business requirements and technical solutions."
      }
    ],
    certifications: [
      {
        name: "Project Management Professional (PMP)",
        issuer: "Project Management Institute",
        dateObtained: "2020-05-15"
      },
      {
        name: "Certified Business Analysis Professional (CBAP)",
        issuer: "International Institute of Business Analysis",
        dateObtained: "2019-11-30"
      },
      {
        name: "Certified Scrum Master (CSM)",
        issuer: "Scrum Alliance",
        dateObtained: "2017-08-22"
      }
    ]
  };

  return (
    <FunctionalTemplate resumeData={mockResumeData} />
  );
} */