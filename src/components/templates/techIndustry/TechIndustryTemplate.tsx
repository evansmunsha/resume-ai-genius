import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Briefcase, GraduationCap, Award, GitBranch, Terminal } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function TechIndustryTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn("p-8", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <SummarySection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
            <ProjectsSection resumeData={resumeData} />
          </div>
          <div className="space-y-6">
            <TechnicalSkillsSection resumeData={resumeData} />
            <CertificationsSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoHeader({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, colorHex, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="flex items-center justify-between pb-4 border-b-2" style={{ borderColor: colorHex }}>
      <div>
        <h1 className="text-3xl font-bold" style={{ color: colorHex }}>
          {firstName} {lastName}
        </h1>
        <p className="text-xl mt-1 text-gray-600">{jobTitle}</p>
        <div className="mt-2 text-sm space-x-4">
          <span>{[city, country].filter(Boolean).join(", ")}</span>
          <span>{phone}</span>
          <span>{email}</span>
        </div>
      </div>
      {photoSrc && (
        <Image
          src={photoSrc || "/placeholder.svg?height=100&width=100"}
          width={100}
          height={100}
          alt="Profile"
          className="object-cover"
          style={{
            borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                        borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
            borderColor: colorHex,
            borderWidth: "2px"
          }}
        />
      )}
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center" style={{ color: colorHex }}>
          <Terminal className="mr-2" size={20} />
          Professional Summary
        </h2>
        <p className="text-sm">{summary}</p>
      </CardContent>
    </Card>
  );
}

function ExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const experiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!experiencesNotEmpty?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colorHex }}>
          <Briefcase className="mr-2" size={20} />
          Professional Experience
        </h2>
        {experiencesNotEmpty.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="font-medium text-base" style={{ color: colorHex }}>{exp.position}</h3>
              {exp.startDate && (
                <p className="text-xs text-gray-600">
                  {formatDate(exp.startDate, "MMM yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"}
                </p>
              )}
            </div>
            <p className="text-sm font-medium text-gray-700">{exp.company}</p>
            <p className="text-sm mt-1 text-gray-600">{exp.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ProjectsSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const projects = workExperiences?.filter(exp => 
    exp.position?.toLowerCase().includes('project') ||
    exp.company?.toLowerCase().includes('project')
  );

  if (!projects?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colorHex }}>
          <GitBranch className="mr-2" size={20} />
          Key Projects
        </h2>
        {projects.map((project, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-medium text-sm" style={{ color: colorHex }}>{project.position}</h3>
            <p className="text-xs text-gray-600">{project.company}</p>
            <p className="text-sm mt-1 text-gray-600">{project.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TechnicalSkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  const technicalSkills = skills?.filter(skill => 
    !skill.toLowerCase().includes('certification') &&
    !skill.toLowerCase().includes('license')
  );

  if (!technicalSkills?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colorHex }}>
          <Code className="mr-2" size={20} />
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {technicalSkills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full text-xs"
              style={{ backgroundColor: `${colorHex}20`, color: colorHex }}
            >
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CertificationsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  const certifications = skills?.filter(skill => 
    skill.toLowerCase().includes('certification') ||
    skill.toLowerCase().includes('license')
  );

  if (!certifications?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colorHex }}>
          <Award className="mr-2" size={20} />
          Certifications
        </h2>
        <ul className="list-disc list-inside text-sm">
          {certifications.map((cert, index) => (
            <li key={index} className="mb-1">{cert}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function EducationSection({ resumeData }: SectionProps) {
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colorHex }}>
          <GraduationCap className="mr-2" size={20} />
          Education
        </h2>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-medium text-sm">{edu.degree}</h3>
            <p className="text-sm text-gray-600">{edu.school}</p>
            {edu.startDate && (
              <p className="text-xs text-gray-500">
                {formatDate(edu.startDate, "yyyy")} - {edu.endDate ? formatDate(edu.endDate, "yyyy") : "Present"}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

