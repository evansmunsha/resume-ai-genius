import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export default function HealthcareTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
        
        <div className="mt-6 space-y-6">
          <SummarySection resumeData={resumeData} />
          <LicensesSection resumeData={resumeData} />
          <ExperienceSection resumeData={resumeData} />
          <div className="grid grid-cols-2 gap-6">
            <EducationSection resumeData={resumeData} />
            <SkillsSection resumeData={resumeData} />
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
    <div className="flex items-center space-x-6 pb-6 border-b-2" style={{ borderColor: colorHex }}>
      {photoSrc && (
        <Image
          src={photoSrc || "/placeholder.svg?height=120&width=120"}
          width={120}
          height={120}
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
      <div className="flex-grow">
        <h1 className="text-3xl font-bold" style={{ color: colorHex }}>
          {firstName} {lastName}
        </h1>
        <p className="text-lg font-medium mt-1 text-gray-600">{jobTitle}</p>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <p>{[city, country].filter(Boolean).join(", ")}</p>
          <p>{phone}</p>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: colorHex }}>Professional Summary</h2>
      <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
    </div>
  );
}

function LicensesSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  const licenses = skills?.filter(skill => 
    skill.toLowerCase().includes('license') || 
    skill.toLowerCase().includes('certification')
  );

  if (!licenses?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: colorHex }}>Licenses & Certifications</h2>
      <div className="flex flex-wrap gap-2">
        {licenses.map((license, index) => (
          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {license}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const experiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!experiencesNotEmpty?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Clinical Experience</h2>
      {experiencesNotEmpty.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium text-lg" style={{ color: colorHex }}>{exp.position}</h3>
            {exp.startDate && (
              <p className="text-sm text-gray-600">
                {formatDate(exp.startDate, "MM/yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
              </p>
            )}
          </div>
          <p className="text-sm font-medium text-gray-700">{exp.company}</p>
          <p className="text-sm mt-1 text-gray-600 leading-relaxed">{exp.description}</p>
        </div>
      ))}
    </div>
  );
}

function EducationSection({ resumeData }: SectionProps) {
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Education</h2>
      {educationsNotEmpty.map((edu, index) => (
        <div key={index} className="mb-3">
          <h3 className="font-medium text-gray-800">{edu.degree}</h3>
          <p className="text-sm text-gray-600">{edu.school}</p>
          {edu.startDate && (
            <p className="text-sm text-gray-500">
              {formatDate(edu.startDate, "yyyy")} - {edu.endDate ? formatDate(edu.endDate, "yyyy") : "Present"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  const healthcareSkills = skills?.filter(skill => 
    !skill.toLowerCase().includes('license') && 
    !skill.toLowerCase().includes('certification')
  );

  if (!healthcareSkills?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Clinical Skills</h2>
      <ul className="list-disc list-inside text-sm text-gray-700 columns-2">
        {healthcareSkills.map((skill, index) => (
          <li key={index} className="mb-1">{skill}</li>
        ))}
      </ul>
    </div>
  );
}
