import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function PhotoIntegratedTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn("p-4", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="col-span-1 space-y-3">
            <ContactSection resumeData={resumeData} />
            <SkillsSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
          <div className="col-span-2 space-y-3">
            <SummarySection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
            <ProjectsSection resumeData={resumeData} />
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
    <div className="flex items-center space-x-6  bg-gray-100">
      {photoSrc && (
        <Image
          src={photoSrc || "/placeholder.svg?height=200&width=200"}
          width={200}
          height={200}
          alt="Profile"
          className="object-cover"
          style={{
            borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                        borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
            borderColor: colorHex,
            borderWidth: "4px"
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

function ContactSection({ resumeData }: SectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  if (!city || !country || !phone || !email || !colorHex) return null;

  return (
    <Card>
      <CardContent className="p-4  bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 bg-gray-200" style={{ color: colorHex }}>Contacts</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <MapPin size={16} className="mr-2" />
            <span>{[city, country].filter(Boolean).join(", ")}</span>
          </div>
          <div className="flex items-center">
            <Phone size={16} className="mr-2" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center">
            <Mail size={16} className="mr-2" />
            <span>{email}</span>
          </div>
          {/* <div className="flex items-center">
            <Linkedin size={16} className="mr-2" />
            <span>linkedin.com/in/yourprofile</span>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2  bg-gray-100" style={{ color: colorHex }}>Professional Summary</h2>
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
        <h2 className="text-lg font-semibold mb-3 bg-gray-100" style={{ color: colorHex }}>Work Experience</h2>
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

function EducationSection({ resumeData }: SectionProps) {
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <Card>
      <CardContent className="p-4  bg-gray-100">
        <h2 className="text-lg font-semibold mb-3  bg-gray-200" style={{ color: colorHex }}>Education</h2>
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

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex,borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <Card>
      <CardContent className="p-4  bg-gray-100 overflow-hidden">
        <h2 className="text-lg font-semibold mb-3 bg-gray-200" style={{ color: colorHex }}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded-full text-xs"
              style={{
                borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                            borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
                borderColor: colorHex,
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
        <h2 className="text-lg font-semibold mb-3  bg-gray-100" style={{ color: colorHex }}>Key Projects</h2>
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

