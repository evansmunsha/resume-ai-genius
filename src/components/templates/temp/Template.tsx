import React, { useRef, useState, useEffect } from 'react';
import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";

interface ModernTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

const emailIcon = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2,
  children: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 12H8m0 0l4-4m-4 4l4 4m-4-4h8"
    />
  ),
};

const phoneIcon = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2,
  children: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10l1.5 1.5a2 2 0 002.5 0L8 10m8 0l1.5 1.5a2 2 0 002.5 0L21 10m-9 4v6m0-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
    />
  ),
};

const locationIcon = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2,
  children: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 0v6m0 0l-3 3m3-3l3 3"
    />
  ),
};

const ModernTemplate: React.FC<ModernTemplateProps> = ({ 
  resumeData, 
  contentRef, 
  className 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const [photoSrc, setPhotoSrc] = useState<string>("");

  useEffect(() => {
    if (resumeData.photo) {
      const objectUrl = resumeData.photo instanceof File 
        ? URL.createObjectURL(resumeData.photo) 
        : resumeData.photo as string;
      setPhotoSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [resumeData.photo]);

  return (
    <div 
      className={cn("aspect-[210/297] w-full bg-white", className)}
      ref={containerRef}
    >
      <div 
        className={cn("h-[297mm] shadow-xl", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }}
        id="resumePreviewContent"
        ref={contentRef}
      >
    
<header className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8">
  <div className="flex items-center gap-8">
    {photoSrc && (
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse"></div>
        <Image 
          src={photoSrc} 
          alt="Profile"
          fill
          className="rounded-full object-cover"
        />
      </div>
    )}
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          {resumeData.firstName} {resumeData.lastName}
        </h1>
        {resumeData.jobTitle && (
          <p className="text-xl mt-2 text-gray-300">{resumeData.jobTitle}</p>
        )}
      </div>
      <div className="flex gap-6 text-gray-400">
        {resumeData.email && (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" {...emailIcon} />
            {resumeData.email}
          </span>
        )}
        {resumeData.phone && (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" {...phoneIcon} />
            {resumeData.phone}
          </span>
        )}
        {(resumeData.city || resumeData.country) && (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" {...locationIcon} />
            {[resumeData.city, resumeData.country].filter(Boolean).join(", ")}
          </span>
        )}
      </div>
    </div>
  </div>
</header>

{/* Three Column Layout */}
<div className="grid grid-cols-[1fr_2fr_1fr] gap-8 p-8 bg-gray-50">
  {/* Left Column */}
  <div className="space-y-6">
    <SkillsSection resumeData={resumeData} />{/* 
    <LanguagesSection resumeData={resumeData} /> */}
  </div>

  {/* Center Column */}
  <div className="space-y-8 bg-white rounded-lg p-6 shadow-sm">
    <ExperienceSection resumeData={resumeData} />
  </div>

  {/* Right Column */}
  <div className="space-y-6">
    <EducationSection resumeData={resumeData} />{/* 
    <CertificationsSection resumeData={resumeData} /> */}
  </div>
</div>
      </div>
    </div>
  );
};


// Skills Section Component
const SkillsSection: React.FC<{ resumeData: ResumeValues }> = ({ resumeData }) => {
    const { skills, colorHex } = resumeData;
    if (!skills?.length) return null;
  
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4" style={{ color: colorHex }}>Skills</h2>
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index} className="group">
              <div className="flex justify-between text-sm mb-1">
                <span>{skill}</span>
                <span className="text-gray-400">
                  {Math.floor(Math.random() * 30 + 70)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 group-hover:opacity-80"
                  style={{
                    width: `${Math.random() * 30 + 70}%`,
                    backgroundColor: colorHex
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Languages Section Component
  /* const LanguagesSection: React.FC<{ resumeData: ResumeValues }> = ({ resumeData }) => {
    if (!resumeData.languages?.length) return null;
  
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4" style={{ color: resumeData.colorHex }}>
          Languages
        </h2>
        <div className="space-y-2">
          {resumeData.languages.map((lang, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: resumeData.colorHex }} />
              <span className="text-gray-700">{lang}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }; */
  
  // Experience Section Component
  const ExperienceSection: React.FC<{ resumeData: ResumeValues }> = ({ resumeData }) => {
    if (!resumeData.workExperiences?.length) return null;
  
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: resumeData.colorHex }}>
          Experience
        </h2>
        <div className="space-y-6">
          {resumeData.workExperiences.map((exp, index) => (
            <div key={index} className="relative pl-6 border-l-2 border-gray-200">
              <div 
                className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2"
                style={{ borderColor: resumeData.colorHex }}
              />
              <div className="space-y-1">
                <h3 className="font-medium">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                {exp.startDate && (
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate, "MMM yyyy")} - 
                    {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"}
                  </p>
                )}
                {exp.description && (
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Education Section Component
  const EducationSection: React.FC<{ resumeData: ResumeValues }> = ({ resumeData }) => {
    if (!resumeData.educations?.length) return null;
  
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4" style={{ color: resumeData.colorHex }}>
          Education
        </h2>
        <div className="space-y-4">
          {resumeData.educations.map((edu, index) => (
            <div key={index} className="space-y-1">
              <h3 className="font-medium">{edu.degree}</h3>
              <p className="text-gray-600">{edu.school}</p>
              {edu.startDate && (
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate, "yyyy")}
                  {edu.endDate && ` - ${formatDate(edu.endDate, "yyyy")}`}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

export default ModernTemplate;