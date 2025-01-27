import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function ModernTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn("", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        {/* Header with accent background */}
        <div 
          className="p-6"
          style={{ backgroundColor: `${resumeData.colorHex}10` }}
        >
          <PersonalInfoHeader resumeData={resumeData} />
        </div>
        
        {/* Main Content */}
        <div className="p-3 grid grid-cols-[2fr_1fr] gap-2">
          <div className="space-y-2">
            <SummarySection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
          </div>
          <div className="space-y-2">
            <SkillsSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
            <ContactSection resumeData={resumeData} />
            <LanguagesSection resumeData={resumeData} />
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
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
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
        <p className="text-xl mt-1 text-gray-600">{jobTitle}</p>
      </div>
        </div>
  );
}

function ContactSection({ resumeData }: SectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;
  if (!email?.length || !phone?.length || !city?.length || !country?.length) return null;

  return (
    
      <Card>
        <CardContent className="p-3">

          <h2 className="text-lg font-semibold" style={{ color: colorHex }}>
            Contact
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            {[city, country].filter(Boolean).length > 0 && (
              <div className="flex items-center gap-2">
                <LocationIcon className="w-4 h-4" style={{ color: colorHex }} />
                <span>{[city, country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" style={{ color: colorHex }} />
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2">
                <EmailIcon className="w-4 h-4" style={{ color: colorHex }} />
                <span>{email}</span>
              </div>
            )}
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
        <CardContent className="p-3">

            <h2 className="text-lg font-semibold" style={{ color: colorHex }}>
              Professional Summary
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {summary}
            </p>
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
      <CardContent className="p-3">

          <h2 className="text-lg font-semibold" style={{ color: colorHex }}>
            Work Experience
          </h2>
          <div className="space-y-3">
            {experiencesNotEmpty.map((exp, index) => (
              <div key={index} className="break-inside-avoid relative pl-4">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                  style={{ backgroundColor: `${colorHex}40` }}
                />
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium" style={{ color: colorHex }}>
                        {exp.position}
                      </h3>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                    </div>
                    {exp.startDate && (
                      <p className="text-sm text-gray-500 shrink-0">
                        {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                        {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.description}
                  </p>
                </div>
                      </div>
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
      <CardContent className="p-3">

          <h2 className="text-lg font-semibold" style={{ color: colorHex }}>
            Education
          </h2>
          <div className="space-y-3">
            {educationsNotEmpty.map((edu, index) => (
              <div key={index} className="break-inside-avoid space-y-1">
                <h3 className="font-medium" style={{ color: colorHex }}>
                  {edu.degree}
                </h3>
                <p className="text-sm text-gray-600">{edu.school}</p>
                {edu.startDate && (
                        <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                    {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
                        </p>
                )}
                      </div>
                    ))}
                  </div>
      </CardContent>
      </Card>
    
  );
}

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages, colorHex } = resumeData;

  if (!languages?.length) return null;

  return (
    <Card>
      <CardContent className="p-4 bg-gray-100 overflow-hidden">
        <h2 className="text-lg font-semibold mb-3 bg-gray-200" style={{ color: colorHex }}>Languages</h2>
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

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    
      <Card>
      <CardContent className="p-3">

        <h2 className="text-lg font-semibold" style={{ color: colorHex }}>
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
                    <span
              key={index}
              className="text-sm px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: `${colorHex}10`,
                color: colorHex
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

// Simple icon components
function LocationIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PhoneIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function EmailIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
} 