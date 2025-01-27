import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Briefcase, GraduationCap, Award, Link, Zap } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function CreativeIndustryTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
            <PortfolioSection resumeData={resumeData} />
          </div>
          <div className="space-y-6">
            <SkillsSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
            <AwardsSection resumeData={resumeData} />
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
    <div className="flex items-center space-x-6">
      {photoSrc && (
        <Image
          src={photoSrc || "/placeholder.svg?height=150&width=150"}
          width={130}
          height={130}
          alt="Profile"
          className="object-cover"
          style={{
            borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                        borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
            borderColor: colorHex,
            borderWidth: "3px"
          }}
        />
      )}
      <div>
        <h1 className="text-4xl font-bold" style={{ color: colorHex }}>
          {firstName} {lastName}
        </h1>
        <p className="text-2xl mt-2 text-gray-600">{jobTitle}</p>
        <div className="mt-2 text-sm space-x-4 text-gray-500">
          <span>{[city, country].filter(Boolean).join(", ")}</span>
          <span>{phone}</span>
          <span>{email}</span>
        </div>
      </div>
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
          <Palette className="mr-2" size={20} />
          Creative Profile
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

function PortfolioSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const portfolioItems = workExperiences?.filter(exp => 
    exp.position?.toLowerCase().includes('project') ||
    exp.company?.toLowerCase().includes('portfolio')
  );

  if (!portfolioItems?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colorHex }}>
          <Link className="mr-2" size={20} />
          Portfolio Highlights
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {portfolioItems.map((item, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium text-sm" style={{ color: colorHex }}>{item.position}</h3>
              <p className="text-xs text-gray-600 mt-1">{item.company}</p>
              <p className="text-xs mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colorHex }}>
          <Zap className="mr-2" size={20} />
          Creative Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
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

function AwardsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  const awards = skills?.filter(skill => 
    skill.toLowerCase().includes('award') ||
    skill.toLowerCase().includes('recognition')
  );

  if (!awards?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colorHex }}>
          <Award className="mr-2" size={20} />
          Awards & Recognition
        </h2>
        <ul className="list-disc list-inside text-sm">
          {awards.map((award, index) => (
            <li key={index} className="mb-1">{award}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
