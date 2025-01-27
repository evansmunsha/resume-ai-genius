import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
    resumeData: ResumeValues;
  }

export function TechnicalTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn("grid grid-cols-[2.5fr_1fr] h-full", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        {/* Main Content */}
        <div className="p-8 space-y-6">
          <PersonalInfoHeader resumeData={resumeData} />
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
        </div>

        {/* Technical Sidebar */}
        <div className="bg-gray-50 p-6 border-l" style={{ borderColor: resumeData.colorHex }}>
          <TechnicalSkillsSection resumeData={resumeData} />
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
      <div className="flex items-center gap-8 border-b-2 pb-6" style={{ borderColor: colorHex }}>
        {photoSrc && (
          <Image
            src={photoSrc}
            width={140}
            height={140}
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
        <div className="flex-grow">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: colorHex }}>
                {firstName} {lastName}
              </h1>
              <p className="mt-1 text-xl font-medium text-gray-600">{jobTitle}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>{[city, country].filter(Boolean).join(", ")}</p>
              <p>{phone}</p>
              <p>{email}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

function TechnicalSkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;
  // Group skills by category (you might want to add categories to your schema)
  const skillCategories = {
    "Programming Languages": skills.filter(s => 
      ["JavaScript", "Python", "Java", "C++", "TypeScript"].some(lang => 
        s.toLowerCase().includes(lang.toLowerCase())
      )
    ),
    "Frameworks & Libraries": skills.filter(s =>
      ["React", "Angular", "Vue", "Node", "Django", "Express"].some(fw =>
        s.toLowerCase().includes(fw.toLowerCase())
      )
    ),
    "Tools & Technologies": skills.filter(s =>
      !["JavaScript", "Python", "Java", "C++", "TypeScript", "React", "Angular", "Vue", "Node", "Django", "Express"].some(excluded =>
        s.toLowerCase().includes(excluded.toLowerCase())
      )
    )
  };

  return (
    <div className="space-y-8">
      {Object.entries(skillCategories).map(([category, categorySkills]) => (
        categorySkills.length > 0 && (
          <div key={category} className="space-y-3">
            <h2 className="text-lg font-bold" style={{ color: colorHex }}>
              {category}
            </h2>
            <div className="flex flex-col gap-2">
              {categorySkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                  style={{ color: colorHex }}
                >
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colorHex }} />
                  <span className="text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="break-inside-avoid space-y-2">
      <h2 className="text-lg font-bold" style={{ color: colorHex }}>
        Technical Profile
      </h2>
      <div className="text-sm text-gray-600 leading-relaxed">
        {summary}
      </div>
    </div>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <div className="break-inside-avoid space-y-4">
      <h2 className="text-lg font-bold" style={{ color: colorHex }}>
        Technical Experience
      </h2>
      <div className="space-y-4">
        {workExperiencesNotEmpty.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-2">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-semibold" style={{ color: colorHex }}>
                  {exp.position}
                </h3>
                <p className="text-sm text-gray-600">{exp.company}</p>
              </div>
              {exp.startDate && (
                <p className="text-xs text-gray-500">
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-600 pl-4 border-l-2" style={{ borderColor: colorHex }}>
              {exp.description}
            </div>
          </div>
        ))}
      </div>
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
      <div className="space-y-3">
        <h2 className="text-xl font-bold" style={{ color: colorHex }}>
          Education
        </h2>
        <hr className="border-2" style={{ borderColor: colorHex }} />
        <div className="space-y-4">
          {educationsNotEmpty.map((edu, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <h3 className="font-semibold" style={{ color: colorHex }}>
                {edu.degree}
              </h3>
              <p className="text-sm text-gray-600">{edu.school}</p>
              {edu.startDate && (
                <p className="text-xs text-gray-500">
                  {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                  {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  } 