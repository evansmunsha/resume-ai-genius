import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPinHouse, Phone } from "lucide-react";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function StartupTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn("p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        
        <div className="mt-0 grid grid-cols-[1fr_2fr] gap-2">
          <div  className="bg-gray-200 px-6 w-full">
            <ContactInfoSection resumeData={resumeData} />
              <SkillsSection resumeData={resumeData} /> 
              <LanguagesSection resumeData={resumeData} />
              {/*<ReferencesSection resumeData={resumeData} /> */}
          </div>
          <div className="space-y-2">
            <ProfileSection resumeData={resumeData} />
            <WorkExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoHeader({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, colorHex,borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="relative bg-[#1E293B] text-white pt-10">
      {/* Header section */}
      <div className="flex items-center gap-6 px-6 py-8 relative">
        {photoSrc && (
          <div
            className="w-52 h-52  h flex-shrink-0 absolute top-2.5 left-[-19]"
            style={{
              borderRadius: borderStyle === BorderStyles.CIRCLE ? "50%" : "10%",
              borderWidth: "4px",
              borderColor: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            

              <Image
                src={photoSrc}
                alt="Profile"
                layout="fill"
                className="object-cover "
              />
            
          </div>
        )}
        <div className="ml w-full ml-11 flex items-center justify-center flex-col">
          <h1 className="text-3xl font-bold uppercase float-right tracking-wide" style={{color: colorHex}}>
            {firstName} {lastName}
          </h1>
          <p className="text-sm font-medium text-gray-300">{jobTitle}</p>
        </div>
      </div>

      
    </div>
  );
}

function ContactInfoSection({ resumeData }: SectionProps) {
  const { phone, email, city, country, colorHex } = resumeData;

  if (!email?.length || !phone?.length || !city?.length || !country?.length) return null;

  return (
    <div className="space-y-1 mt-24">

      <h2 className="text-lg font-bold" style={{ color: colorHex }}>
        Contact
      </h2>
      <div className="w-full h-[4px] bg-gray-800 border-zinc-700 mt-0" />
      <div className="text-sm space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-icons text-gray-600"><Phone/></span>
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-icons text-gray-600"><Mail /></span>
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-icons text-gray-600"><MapPinHouse /></span>
          <span>{[city, country].filter(Boolean).join(", ")}</span>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold" style={{ color: colorHex }}>
        Profile
      </h2>
      <p className="text-sm leading-relaxed">
        {summary}
      </p>
    </div>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold" style={{ color: colorHex }}>
        Work Experience
      </h2>
      <div className="space-y-3">
        {workExperiences.map((exp, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between">
              <h3 className="font-medium" style={{ color: colorHex }}>
                {exp.position}
              </h3>
              <span className="text-sm text-gray-600">
                {exp.startDate && formatDate(exp.startDate, "yyyy")} - {exp.endDate ? formatDate(exp.endDate, "yyyy") : "Present"}
              </span>
            </div>
            <p className="text-sm text-gray-600">{exp.company}</p>
            <p className="text-sm leading-relaxed">{exp.description}</p>
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
    <div className="space-y-3">
      <h2 className="text-lg font-bold" style={{ color: colorHex }}>
        Education
      </h2>
      <div className="space-y-3">
        {educations.map((edu, index) => (
          <div key={index} className="space-y-1">
            <h3 className="font-medium" style={{ color: colorHex }}>
              {edu.degree}
            </h3>
            <p className="text-sm">{edu.school}</p>
            <span className="text-xs text-gray-600">
              {edu.startDate && formatDate(edu.startDate, "yyyy")} - {edu.endDate ? formatDate(edu.endDate, "yyyy") : "Present"}
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
    <div className="space-y-1">
      <h2 className="text-lg font-bold mt-6" style={{ color: colorHex }}>
        Skills
      </h2>
      <div className="w-full h-[4px] bg-gray-800 border-zinc-700 mt-0" />
      <ul className="list-disc pl-5 text-sm space-y-1">
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages, colorHex } = resumeData;

  if (!languages?.length) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold" style={{ color: colorHex }}>
        Languages
      </h2>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {languages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
    </div>
  );
} 

/* function ReferencesSection({ resumeData }: SectionProps) {
  const { references, colorHex } = resumeData;

  if (!references?.length) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold" style={{ color: colorHex }}>
        References
      </h2>
      <div className="space-y-2">
        {references.map((ref, index) => (
          <div key={index} className="text-sm">
            <p className="font-medium">{ref.name}</p>
            <p>{ref.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
} */
