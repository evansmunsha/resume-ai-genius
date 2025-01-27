import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone, Globe, Briefcase, GraduationCap, Award, User2, Target, Zap, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export default function ChronologicalTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
          <div className="grid grid-cols-2 gap-6">
            <SkillsSection resumeData={resumeData} />
            <div className="space-y-6">
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
        Work Experience
      </h2>
      <div className="space-y-6">
        {workExperiences.map((exp, index) => (
          <div key={index} className="relative pl-6 pb-6 last:pb-0">
            <div className="absolute left-0 top-1 bottom-0 w-px bg-gray-200" />
            <div className="absolute left-0 top-1 w-2 h-2 rounded-full" style={{ backgroundColor: colorHex }} />
            <div className="space-y-2">
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
      <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: colorHex }}>
        <GraduationCap size={20} />
        Education
      </h2>
      <div className="space-y-4">
        {educations.map((edu, index) => (
          <div key={index} className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.school}</p>
            </div>
            <span 
              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
              style={{ 
                backgroundColor: `${colorHex}15`,
                color: colorHex
              }}
            >
              <Clock size={12} />
              {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
              {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
            </span>
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
      <div className="flex flex-wrap gap-2">
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
    firstName: "Emily",
    lastName: "Chen",
    jobTitle: "Software Engineer",
    photo: "/placeholder.svg?height=120&width=120",
    city: "San Francisco",
    country: "CA",
    phone: "(555) 123-4567",
    email: "emily.chen@example.com",
    colorHex: "#0891b2",
    borderStyle: BorderStyles.ROUNDED,
    summary: "Dedicated and innovative Software Engineer with 5+ years of experience in full-stack development. Passionate about creating efficient, scalable, and user-friendly applications. Proven track record of delivering high-quality software solutions in fast-paced environments.",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "SQL",
      "AWS",
      "Docker",
      "Git",
      "Agile/Scrum",
      "RESTful APIs",
      "CI/CD"
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "Mandarin", level: "Fluent" },
      { name: "Spanish", level: "Intermediate" }
    ],
    educations: [
      {
        degree: "Master of Science in Computer Science",
        school: "Stanford University",
        startDate: "2014-09-01",
        endDate: "2016-06-30"
      },
      {
        degree: "Bachelor of Science in Computer Engineering",
        school: "University of California, Berkeley",
        startDate: "2010-09-01",
        endDate: "2014-05-31"
      }
    ],
    workExperiences: [
      {
        position: "Senior Software Engineer",
        company: "TechCorp Solutions",
        startDate: "2020-03-01",
        endDate: null,
        description: "Lead development of microservices architecture for scalable cloud applications. Mentor junior developers and contribute to architectural decisions. Implemented CI/CD pipelines, reducing deployment time by 40%."
      },
      {
        position: "Software Engineer",
        company: "InnovateSoft Inc.",
        startDate: "2016-07-01",
        endDate: "2020-02-29",
        description: "Developed and maintained full-stack web applications using React and Node.js. Collaborated with cross-functional teams to deliver features on time. Optimized database queries, improving application performance by 30%."
      },
      {
        position: "Software Engineering Intern",
        company: "StartUp Technologies",
        startDate: "2015-06-01",
        endDate: "2015-08-31",
        description: "Assisted in the development of a mobile application using React Native. Implemented RESTful APIs and integrated third-party services. Participated in code reviews and agile development processes."
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        dateObtained: "2022-03-15"
      },
      {
        name: "Professional Scrum Master I (PSM I)",
        issuer: "Scrum.org",
        dateObtained: "2021-09-30"
      }
    ]
  };

  return (
    <ChronologicalTemplate resumeData={mockResumeData} />
  );
} */