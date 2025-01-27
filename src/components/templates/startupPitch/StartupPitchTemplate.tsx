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

export function StartupPitchTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
        {/* Header */}
        <div 
          className="relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${resumeData.colorHex}15 0%, ${resumeData.colorHex}30 100%)`,
            borderBottom: `3px solid ${resumeData.colorHex}`
          }}
        >
          <div className="px-8 py-8 relative z-10">
            <PersonalInfoHeader resumeData={resumeData} />
          </div>
          {/* Decorative Elements */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 opacity-10"
            style={{
              background: `radial-gradient(circle, ${resumeData.colorHex} 0%, transparent 70%)`,
              transform: 'translate(20%, -20%)'
            }}
          />
        </div>

        {/* Main Content */}
        <div className="p-2 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-2">
            <SummarySection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
          <div 
            className="space-y-2 p-2 rounded-lg"
            style={{ 
              backgroundColor: `${resumeData.colorHex}08`,
              borderLeft: `2px solid ${resumeData.colorHex}30`
            }}
          >
            <SkillsSection resumeData={resumeData} />
            <ContactSection resumeData={resumeData} />
            {/* <CertificationsSection resumeData={resumeData} /> */}
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
    <div className="flex items-center gap-8">
      {photoSrc && (
        <div className="relative">
          <Image
            src={photoSrc || "/placeholder.svg?height=160&width=160"}
            width={160}
            height={160}
            alt="Profile"
            className="object-cover"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
              borderColor: colorHex,
              borderWidth: "3px",
              boxShadow: `0 4px 20px ${colorHex}30`
            }}
          />
        </div>
      )}
      <div>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: colorHex }}>
          {firstName} {lastName}
        </h1>
        <p className="text-2xl mt-2 font-medium text-gray-600">{jobTitle}</p>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: colorHex }}>
        <span className="w-8 h-[2px]" style={{ backgroundColor: colorHex }}></span>
        Professional Summary
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        {summary}
      </p>
    </div>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: colorHex }}>
        <span className="w-8 h-[2px]" style={{ backgroundColor: colorHex }}></span>
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span 
            key={index}
            className="px-3 py-1 rounded-full text-sm"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
              borderColor: colorHex,
              borderWidth: "3px",
              boxShadow: `0 4px 20px ${colorHex}30`
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function ContactSection({ resumeData }: SectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  if (!email || !phone || !city || !country) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: colorHex }}>
        <span className="w-8 h-[2px]" style={{ backgroundColor: colorHex }}></span>
        Contact
      </h2>
      <div className="space-y-2 text-sm">
        {[city, country].filter(Boolean).length > 0 && (
          <div className="flex items-center gap-2">
            <MapPinHouse size={16} style={{ color: colorHex }}/>
            <p>{[city, country].filter(Boolean).join(", ")}</p>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone size={16} style={{ color: colorHex }}/>
            <p>{phone}</p>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <Mail size={16} style={{ color: colorHex }}/>
            <p>{email}</p>
          </div>
        )}
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
    <div className="space-y-6">
      <h2 className="text-base font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: colorHex }}>
        <span className="w-8 h-[2px]" style={{ backgroundColor: colorHex }}></span>
        Experience
      </h2>
      <div className="space-y-8">
        {experiencesNotEmpty.map((exp, index) => (
          <div key={index} className="relative pl-4" style={{ borderLeft: `2px solid ${colorHex}30` }}>
            <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: colorHex }} />
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium text-gray-600">{exp.company}</p>
              {exp.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
              )}
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
    <div className="space-y-6">
      <h2 className="text-base font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: colorHex }}>
        <span className="w-8 h-[2px]" style={{ backgroundColor: colorHex }}></span>
        Education
      </h2>
      <div className="space-y-8">
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="relative pl-4" style={{ borderLeft: `2px solid ${colorHex}30` }}>
            <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: colorHex }} />
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <span className="text-sm text-gray-500">
                  {edu.startDate && formatDate(new Date(edu.startDate), "MMM yyyy")} -{" "}
                  {edu.endDate ? formatDate(new Date(edu.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium text-gray-600">{edu.school}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
