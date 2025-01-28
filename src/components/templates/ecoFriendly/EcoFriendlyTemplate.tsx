import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Leaf, Sprout, TreePine, Recycle, Wind, Globe2, Mail, Phone, MapPin } from "lucide-react";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function EcoFriendlyTemplate({ resumeData, contentRef, className }: TemplateProps) {
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
        {/* Header with Leaf Pattern */}
        <div 
          className="relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${resumeData.colorHex}15 0%, ${resumeData.colorHex}30 100%)`,
          }}
        >
          {/* Organic Border */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-2 opacity-50"
            style={{ 
              background: `linear-gradient(90deg, transparent 0%, ${resumeData.colorHex} 50%, transparent 100%)`,
              clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)"
            }}
          />
          
          {/* Leaf Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                <Leaf size={24} style={{ color: resumeData.colorHex }} />
              </div>
            ))}
          </div>

          <div className="px-8 py-8 relative z-10">
            <PersonalInfoHeader resumeData={resumeData} />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          {/* Left Column */}
          <div className="p-8 space-y-8">
            <SummarySection resumeData={resumeData} />
            <SustainabilitySection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>

          {/* Right Column with Natural Border */}
          <div 
            className="p-8 space-y-8 relative"
            style={{ 
              backgroundColor: `${resumeData.colorHex}08`,
              borderLeft: `2px solid ${resumeData.colorHex}30`,
            }}
          >
            {/* Organic Decorative Elements */}
            <div 
              className="absolute top-0 left-0 w-16 h-16 opacity-10"
              style={{
                background: `radial-gradient(circle at top left, ${resumeData.colorHex}, transparent)`,
              }}
            />
            
            <SkillsSection resumeData={resumeData} />
            {/* <CertificationsSection resumeData={resumeData} /> */}
            <ContactSection resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoHeader({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, borderStyle } = resumeData;
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
            src={photoSrc}
            width={140}
            height={140}
            alt="Profile"
            className="object-cover"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "8px",
              border: `2px solid ${resumeData.colorHex}40`,
              boxShadow: `0 4px 20px ${resumeData.colorHex}20`
            }}
          />
          {/* Leaf Accent */}
          <div 
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: resumeData.colorHex,
              opacity: 0.9
            }}
          >
            <Leaf size={16} className="text-white" />
          </div>
        </div>
      )}
      <div>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: resumeData.colorHex }}>
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
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Sprout size={20} style={{ color: colorHex }} />
        Environmental Vision
      </h2>
      <div 
        className="p-4 text-base text-gray-600 leading-relaxed rounded-lg"
        style={{ 
          backgroundColor: `${colorHex}08`,
          borderLeft: `3px solid ${colorHex}`,
        }}
      >
        {summary}
      </div>
    </div>
  );
}

function SustainabilitySection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  // Filter for sustainability-related experiences
  const sustainabilityExperiences = workExperiences?.filter(exp => 
    exp.description?.toLowerCase().includes('sustain') ||
    exp.description?.toLowerCase().includes('environment') ||
    exp.description?.toLowerCase().includes('eco') ||
    exp.description?.toLowerCase().includes('green') ||
    exp.position?.toLowerCase().includes('sustain') ||
    exp.position?.toLowerCase().includes('environment') ||
    exp.company?.toLowerCase().includes('eco')
  );

  if (!sustainabilityExperiences?.length) return null;

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <TreePine size={20} style={{ color: colorHex }} />
        Sustainability Impact
      </h2>
      <div className="space-y-6">
        {sustainabilityExperiences.map((exp, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}20`
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium" style={{ color: colorHex }}>{exp.company}</p>
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

function ExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  // Filter out sustainability experiences to avoid duplication
  const otherExperiences = workExperiences?.filter(exp => 
    !(exp.description?.toLowerCase().includes('sustain') ||
      exp.description?.toLowerCase().includes('environment') ||
      exp.description?.toLowerCase().includes('eco') ||
      exp.description?.toLowerCase().includes('green') ||
      exp.position?.toLowerCase().includes('sustain') ||
      exp.position?.toLowerCase().includes('environment') ||
      exp.company?.toLowerCase().includes('eco'))
  );

  if (!otherExperiences?.length) return null;

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Globe2 size={20} style={{ color: colorHex }} />
        Professional Experience
      </h2>
      <div className="space-y-6">
        {otherExperiences.map((exp, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}20`
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium" style={{ color: colorHex }}>{exp.company}</p>
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

  if (!educations?.length) return null;

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Wind size={20} style={{ color: colorHex }} />
        Education
      </h2>
      <div className="space-y-4">
        {educations.map((edu, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}20`
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <span className="text-sm text-gray-500">
                  {edu.startDate && formatDate(new Date(edu.startDate), "MMM yyyy")} -{" "}
                  {edu.endDate ? formatDate(new Date(edu.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium" style={{ color: colorHex }}>{edu.school}</p>
            </div>
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
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Recycle size={20} style={{ color: colorHex }} />
        Core Competencies
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="px-3 py-2 text-sm rounded-lg"
            style={{ 
              backgroundColor: `${colorHex}15`,
              border: `1px solid ${colorHex}30`,
            }}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}

/* function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications, colorHex } = resumeData;

  if (!certifications?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Leaf size={20} style={{ color: colorHex }} />
        Certifications
      </h2>
      <div className="space-y-2">
        {certifications.map((cert, index) => (
          <div 
            key={index}
            className="p-3 text-sm rounded-lg"
            style={{ 
              backgroundColor: `${colorHex}15`,
              border: `1px solid ${colorHex}30`,
            }}
          >
            {cert}
          </div>
        ))}
      </div>
    </div>
  );
} */

function ContactSection({ resumeData }: SectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;
  if (!email?.length || !phone?.length || !city?.length || !country?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Globe2 size={20} style={{ color: colorHex }} />
        Contact Details
      </h2>
      <div className="space-y-3">
        {[city, country].filter(Boolean).length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} style={{ color: colorHex }} />
            <span>{[city, country].filter(Boolean).join(", ")}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} style={{ color: colorHex }} />
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail size={16} style={{ color: colorHex }} />
            <span>{email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
