import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";


interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
  colorHex?: string;
}


export function DistinctiveTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const { colorHex } = resumeData;

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black border-4 border-gray-800", className)}
      ref={containerRef}
    >
      <div
        className={cn("p-2", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        
        <div className="mt-6 grid grid-cols-4 gap-1">
          <div className="col-span-3 space-y-2">
            <SummarySection resumeData={resumeData} colorHex={colorHex} />
            <ExperienceSection resumeData={resumeData} colorHex={colorHex} />
            <ProjectsSection resumeData={resumeData} colorHex={colorHex} />
          </div>
          <div className="col-span-1 space-y-2">
            <ContactSection resumeData={resumeData} colorHex={colorHex} />
            <SkillsSection resumeData={resumeData} colorHex={colorHex} />
            <EducationSection resumeData={resumeData} colorHex={colorHex} />
            <LanguagesSection resumeData={resumeData} colorHex={colorHex} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoHeader({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, borderStyle, colorHex } = resumeData;
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
          src={photoSrc}
          width={120}
          height={120}
          alt="Profile"
          className="aspect-square object-cover"
          style={{
            borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
            borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
            borderColor: colorHex,
            borderWidth: "2px"
            }}
            />
          )}
      <div>
        <h1 className="text-4xl font-bold" style={{ color: colorHex }}>
          {firstName} {lastName}
        </h1>
        <p className="text-2xl mt-2 text-gray-600">{jobTitle}</p>
      </div>
    </div>
  );
}

function ContactSection({ resumeData, colorHex }: SectionProps) {
  const { city, country, phone, email } = resumeData;

  if (!email?.length || !phone?.length || !city?.length || !country?.length) return null;

  return (
    <Card>
      <CardContent className="p-1 rounded-lg border-2 border-gray-800">
        <h2 className="text-lg font-semibold mb-3" style={{ color: colorHex }}>Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <MapPin size={16} className="mr-2" />
            <span>{[city, country].filter(Boolean).join(", ")}</span>
          </div>
          <div className="flex items-center">
            <Phone size={16} className="mr-2" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center text-wrap">
            <Mail size={16} className="mr-2 h-5 w-5" />
            <span className="break-all">{email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummarySection({ resumeData, colorHex }: SectionProps) {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <Card>
      <CardContent className="p-4 border-2 border-gray-800">
        <h2 className="text-lg font-semibold mb-2" style={{ color: colorHex }}>Professional Summary</h2>
        <p className="text-sm">{summary}</p>
      </CardContent>
    </Card>
  );
}

function ExperienceSection({ resumeData, colorHex }: SectionProps) {
  const { workExperiences } = resumeData;

  const experiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!experiencesNotEmpty?.length) return null;

  return (
    <Card>
      <CardContent className="p-4 border-2 border-gray-800">
        <h2 className="text-lg font-semibold mb-3" style={{ color: colorHex }}>Experience</h2>
        {experiencesNotEmpty.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-medium text-base">{exp.position}</h3>
            <p className="text-sm font-medium text-gray-700">{exp.company}</p>
            <p className="text-sm mt-1 text-gray-600">{exp.description}</p>
            {exp.startDate && (
              <p className="text-xs text-gray-600">
                {formatDate(exp.startDate, "MMM yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EducationSection({ resumeData, colorHex }: SectionProps) {
  const { educations } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <Card>
      <CardContent className="p-4 border-2 border-gray-800">
        <h2 className="text-lg font-semibold mb-3" style={{ color: colorHex }}>Education</h2>
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

function SkillsSection({ resumeData, colorHex }: SectionProps) {
  const { skills, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <Card>
      <CardContent className="p-4 border-2 border-gray-800">
        <h2 className="text-lg font-semibold mb-3" style={{ color: colorHex }}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded-full text-xs"
              style={{
                borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
                borderColor: colorHex,
                borderWidth: "2px"
                }}
            >
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LanguagesSection({ resumeData, colorHex }: SectionProps) {
  const { languages } = resumeData;

  if (!languages?.length) return null;

  return (
    <Card>
      <CardContent className="p-4 border-2 border-gray-800">
        <h2 className="text-lg font-semibold mb-3" style={{ color: colorHex }}>Languages</h2>
        <div className="space-y-2">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center">
              <Globe size={16} className="mr-2" />
              <span>{lang}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsSection({ resumeData, colorHex }: SectionProps) {
  const { workExperiences } = resumeData;

  const projects = workExperiences?.filter(exp => 
    exp.position?.toLowerCase().includes('project') ||
    exp.company?.toLowerCase().includes('project')
  );

  if (!projects?.length) return null;

  return (
    <Card>
      <CardContent className="p-4 border-2 border-gray-800">
        <h2 className="text-lg font-semibold mb-3" style={{ color: colorHex }}>Key Projects</h2>
        {projects.map((project, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-medium text-sm">{project.position}</h3>
            <p className="text-xs text-gray-600">{project.company}</p>
            <p className="text-sm mt-1 text-gray-600">{project.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}