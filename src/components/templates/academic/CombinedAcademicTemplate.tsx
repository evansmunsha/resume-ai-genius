import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export function CombinedAcademicTemplate({ resumeData, contentRef, className }: TemplateProps) {
  console.log("Resume Data:", resumeData);
  console.log("Languages Data:", resumeData.languages);

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn("p-2", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <div className="mt-8 space-y-6">
          {resumeData.summary && <SummarySection resumeData={resumeData} />}
          {resumeData.workExperiences?.filter(exp => Object.keys(exp).length > 0).length ? (
            <WorkExperienceSection resumeData={resumeData} />
          ) : (
            ''
          )}
          {resumeData.educations?.length ? (
            <EducationSection resumeData={resumeData} />
          ) : (
            ''
          )}
          {resumeData.languages?.length ? (
            <LanguageSection resumeData={resumeData} />
          ) : (
            ''
          )}
          {resumeData.skills?.length ? (
            <SkillsSection resumeData={resumeData} />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}

function PersonalInfoHeader({ resumeData }: { resumeData: ResumeValues }) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, colorHex, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <>
      <div className="flex items-center justify-between" style={{ borderColor: colorHex }}>
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold" style={{ color: colorHex }}>
            {firstName} {lastName}
          </h1>
          {jobTitle && <p className="text-xl font-serif text-gray-600 mt-0">{jobTitle}</p>}
          <div className="text-sm gap-2 text-gray-600 font-serif flex items-center">
            <p>{[city, country].filter(Boolean).join(", ")}</p>
            <p>{phone}</p>
            <p>{email}</p> 
          </div>
        </div>
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
      </div>
      <hr className="border-2 mt-1" style={{ borderColor: colorHex }} />
    </>
    
  );
}

function SummarySection({ resumeData }: { resumeData: ResumeValues }) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <>
      <div className="space-y-2">
        <h2 className=" font-semibold" style={{ color: colorHex }}>
          Professional Summary
         <hr className="border-2" style={{ borderColor: colorHex }} />
        </h2>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
}

function WorkExperienceSection({ resumeData }: { resumeData: ResumeValues }) {
  const { workExperiences, colorHex } = resumeData;
  const workExperiencesNotEmpty = workExperiences?.filter(exp => Object.values(exp).filter(Boolean).length > 0);

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold" style={{ color: colorHex }}>
          Work Experience
          <hr className="border-2" style={{ borderColor: colorHex }} />
        </h2>
        {workExperiencesNotEmpty.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold" style={{ color: colorHex }}>
              <span>{exp.position}</span>
              {exp.startDate && <span>{formatDate(exp.startDate, "MM/yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}</span>}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <div className="whitespace-pre-line text-sm">{exp.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function EducationSection({ resumeData }: { resumeData: ResumeValues }) {
  const { educations, colorHex } = resumeData;
  const educationsNotEmpty = educations?.filter(edu => Object.values(edu).filter(Boolean).length > 0);

  if (!educationsNotEmpty?.length) return null;

  return (
    <>
      <div className="space-y-3">
        <h2 className="font-semibold" style={{ color: colorHex }}>
          Education
          <hr className="border-2" style={{ borderColor: colorHex }} />
        </h2>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold" style={{ color: colorHex }}>
              <span>{edu.degree}</span>
              {edu.startDate && <span>{formatDate(edu.startDate, "MM/yyyy")} - {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : ""}</span>}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function LanguageSection({ resumeData }: { resumeData: ResumeValues }) {
  const { languages, colorHex } = resumeData;

  if (!languages?.length) return null;

  const languageCategories = {
    "Research Methods": languages.filter(s => 
      ["research", "analysis", "methodology"].some(term => 
        s.toLowerCase().includes(term)
      )
    ),
    "Technical languages": languages.filter(s =>
      ["software", "programming", "statistics", "data"].some(term =>
        s.toLowerCase().includes(term)
      )
    ),
    "Languages": languages.filter(s =>
      ["english", "spanish", "french", "german", "chinese", "japanese"].some(lang =>
        s.toLowerCase().includes(lang)
      )
    ),
    "Other languages": languages.filter(s =>
      !["research", "analysis", "methodology", "software", "programming", "statistics", "data",
        "english", "spanish", "french", "german", "chinese", "japanese"].some(excluded =>
        s.toLowerCase().includes(excluded)
      )
    )
  };

  return (
    <>
      <div className="space-y-3">
        <h2 className=" font-semibold" style={{ color: colorHex }}>
          Language & Expertise
          <hr className="border-2" style={{ borderColor: colorHex }} />
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(languageCategories).map(([category, categoryLanguage]) => (
            categoryLanguage.length > 0 && (
              <div key={category} className="space-y-2">
                <h3 className="font-medium font-serif text-lg" style={{ color: colorHex }}>
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryLanguage.map((language, index) => (
                    <span
                      key={index}
                      className="text-sm px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${colorHex}10`,
                        color: colorHex
                      }}
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
}

function SkillsSection({ resumeData }: { resumeData: ResumeValues }) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <>
      <div className="space-y-3">
        <div className="text-lg font-semibold" style={{ color: colorHex }}>
          Skills
          <hr className="border-2" style={{ borderColor: colorHex }} />
        </div>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="text-sm px-2 py-1 rounded-md text-gray-200" style={{ backgroundColor: colorHex }}>{skill}</span>
          ))}
        </div>
      </div>
    </>
  );
}
