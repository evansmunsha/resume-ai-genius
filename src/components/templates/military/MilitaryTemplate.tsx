import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone, Briefcase, GraduationCap, Target, Crosshair, Shield, Users, Zap, Globe } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function MilitaryTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("flex flex-col", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact"
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        {/* Header */}
        <div 
          className="relative overflow-hidden print:overflow-visible"
          style={{ 
            background: `linear-gradient(135deg, ${resumeData.colorHex}, ${resumeData.colorHex}90)`,
          }}
        >
          <div className="px-8 py-8 relative z-10">
            <PersonalInfoHeader resumeData={resumeData} />
          </div>
          {/* Military-inspired background pattern */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                <Crosshair className="w-6 h-6 text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[1fr_2fr] gap-6 p-8 print:grid-cols-[1fr_2fr] print:break-inside-avoid">
          {/* Sidebar */}
          <div className="space-y-8">
            <ContactSection resumeData={resumeData} />
            <LanguagesSection resumeData={resumeData} />
            <SkillsSection resumeData={resumeData} />
            {/* <CertificationsSection resumeData={resumeData} /> */}
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <SummarySection resumeData={resumeData} />
            <MilitaryServiceSection resumeData={resumeData} />
            <CivilianExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ... (previous sections remain the same until SkillsSection)

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages, colorHex } = resumeData;

  if (!languages?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Globe size={24} style={{ color: colorHex }} />
        Languages
      </h2>
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-2 rounded-md"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}30`,
            }}
          >
            <span className="font-medium">{lang}</span>
            <span 
              className="text-sm px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${colorHex}15`,
                color: colorHex
              }}
            >
              {lang}
            </span>
          </div>
        ))}
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
    <div className="flex items-center gap-8 text-white">
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
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "8px",
              border: "3px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}
          />
          {/* Military-inspired photo frame */}
          {borderStyle !== BorderStyles.CIRCLE && (
            <>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white opacity-50" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-50" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white opacity-50" />
            </>
          )}
        </div>
      )}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {firstName} {lastName}
        </h1>
        <p className="text-2xl mt-2 font-medium text-white opacity-90">{jobTitle}</p>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Target size={24} style={{ color: colorHex }} />
        Mission Objective
      </h2>
      <div 
        className="p-4 text-base text-gray-700 leading-relaxed rounded-md"
        style={{ 
          backgroundColor: `${colorHex}08`,
          border: `2px solid ${colorHex}30`,
        }}
      >
        {summary}
      </div>
    </div>
  );
}

function MilitaryServiceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const militaryExperiences = workExperiences?.filter(
    (exp) => exp.position?.toLowerCase().includes('military') || 
             exp.company?.toLowerCase().includes('army') || 
             exp.company?.toLowerCase().includes('navy') || 
             exp.company?.toLowerCase().includes('air force') || 
             exp.company?.toLowerCase().includes('marines') ||
             exp.company?.toLowerCase().includes('coast guard')
  );

  if (!militaryExperiences?.length) return null;

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Shield size={24} style={{ color: colorHex }} />
        Military Service
      </h2>
      <div className="space-y-6">
        {militaryExperiences.map((exp, index) => (
          <div 
            key={index} 
            className="relative p-4 rounded-md"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `2px solid ${colorHex}30`,
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <span 
                  className="text-sm px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${colorHex}15`,
                    color: colorHex
                  }}
                >
                  {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium text-gray-600">{exp.company}</p>
              {exp.description && (
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CivilianExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const civilianExperiences = workExperiences?.filter(
    (exp) => !(exp.position?.toLowerCase().includes('military') || 
               exp.company?.toLowerCase().includes('army') || 
               exp.company?.toLowerCase().includes('navy') || 
               exp.company?.toLowerCase().includes('air force') || 
               exp.company?.toLowerCase().includes('marines') ||
               exp.company?.toLowerCase().includes('coast guard'))
  );

  if (!civilianExperiences?.length) return null;

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Briefcase size={24} style={{ color: colorHex }} />
        Civilian Experience
      </h2>
      <div className="space-y-6">
        {civilianExperiences.map((exp, index) => (
          <div 
            key={index} 
            className="relative p-4 rounded-md"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `2px solid ${colorHex}30`,
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <span 
                  className="text-sm px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${colorHex}15`,
                    color: colorHex
                  }}
                >
                  {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium text-gray-600">{exp.company}</p>
              {exp.description && (
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{exp.description}</p>
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
      <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <GraduationCap size={24} style={{ color: colorHex }} />
        Education & Training
      </h2>
      <div className="space-y-6">
        {educations.map((edu, index) => (
          <div 
            key={index} 
            className="relative p-4 rounded-md"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `2px solid ${colorHex}30`,
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <span 
                  className="text-sm px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${colorHex}15`,
                    color: colorHex
                  }}
                >
                  {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
                  {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
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

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Zap size={24} style={{ color: colorHex }} />
        Core Competencies
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="relative px-3 py-2 text-sm break-words rounded-full"
            style={{ 
              backgroundColor: `${colorHex}15`,
              color: colorHex,
              border: `1px solid ${colorHex}30`,
            }}
          >
            <span>{skill}</span>
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
      <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Award size={24} style={{ color: colorHex }} />
        Certifications & Awards
      </h2>
      <ul className="space-y-3">
        {certifications.map((cert, index) => (
          <li 
            key={index}
            className="relative p-3 rounded-md"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}30`,
            }}
          >
            <span className="font-medium">{cert.name}</span>
            {cert.issuer && <span className="text-gray-600 block text-sm"> {cert.issuer}</span>}
            {cert.dateObtained && (
              <span className="text-gray-600 text-sm block">
                Obtained: {formatDate(new Date(cert.dateObtained), "MMM yyyy")}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} */

function ContactSection({ resumeData }: SectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  if (!email?.length || !phone?.length || !city?.length || !country?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Users size={24} style={{ color: colorHex }} />
        Contact Information
      </h2>
      <div className="space-y-3">
        {[city, country].filter(Boolean).length > 0 && (
          <div className="flex items-center gap-2">
            <MapPin size={18} style={{ color: colorHex }}/>
            <p className="text-sm">{[city, country].filter(Boolean).join(", ")}</p>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone size={18} style={{ color: colorHex }}/>
            <p className="text-sm">{phone}</p>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <Mail size={18} style={{ color: colorHex }}/>
            <p className="text-sm">{email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* export default function Component() {
  // Mock data for preview
  const mockResumeData: ResumeValues = {
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Veteran Transition Specialist",
    photo: "/placeholder.svg?height=160&width=160",
    city: "Washington",
    country: "D.C.",
    phone: "(555) 123-4567",
    email: "john.doe@example.com",
    colorHex: "#1e3a8a",
    borderStyle: BorderStyles.ROUNDED,
    summary: "Dedicated and experienced military veteran with a strong background in leadership, strategic planning, and team management. Seeking to leverage my extensive military experience and skills in a civilian role to drive organizational success and mentor transitioning veterans.",
    skills: [
      "Leadership", "Strategic Planning", "Team Management", "Crisis Management",
      "Logistics", "Training & Development", "Project Management", "Communication",
      "Adaptability", "Problem Solving", "Security Clearance", "Veterans Affairs"
    ],
    educations: [
      {
        degree: "Master of Business Administration",
        school: "American Military University",
        startDate: "2018-09-01",
        endDate: "2020-05-31"
      },
      {
        degree: "Bachelor of Science in Military Science",
        school: "United States Military Academy at West Point",
        startDate: "2006-08-01",
        endDate: "2010-05-31"
      }
    ],
    workExperiences: [
      {
        position: "Battalion Commander",
        company: "U.S. Army",
        startDate: "2018-06-01",
        endDate: "2022-12-31",
        description: "Led and managed a battalion of 500+ personnel. Developed and implemented strategic plans for complex military operations. Oversaw training programs to ensure combat readiness and mission success."
      },
      {
        position: "Company Commander",
        company: "U.S. Army",
        startDate: "2014-07-01",
        endDate: "2018-05-31",
        description: "Commanded a company of 150 soldiers. Responsible for the training, welfare, and combat readiness of all personnel. Successfully led multiple overseas deployments with zero casualties."
      },
      {
        position: "Veteran Transition Coordinator",
        company: "Veterans Affairs Office",
        startDate: "2023-01-01",
        endDate: null,
        description: "Assist military veterans in their transition to civilian life. Develop and implement programs to support job placement, education opportunities, and access to benefits. Collaborate with local businesses to create employment opportunities for veterans."
      }
    ],
    certifications: [
      {
        name: "Project Management Professional (PMP)",
        issuer: "Project Management Institute",
        dateObtained: "2021-03-15"
      },
      {
        name: "Lean Six Sigma Black Belt",
        issuer: "American Society for Quality",
        dateObtained: "2020-11-30"
      }
    ]
  };

  return (
    <MilitaryTemplate resumeData={mockResumeData} />
  );
} */

/* export default function Component() {
  // Mock data for preview
  const mockResumeData: ResumeValues = {
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Veteran Transition Specialist",
    photo: "/placeholder.svg?height=160&width=160",
    city: "Washington",
    country: "D.C.",
    phone: "(555) 123-4567",
    email: "john.doe@example.com",
    colorHex: "#1e3a8a",
    borderStyle: BorderStyles.ROUNDED,
    summary: "Dedicated and experienced military veteran with a strong background in leadership, strategic planning, and team management. Seeking to leverage my extensive military experience and skills in a civilian role to drive organizational success and mentor transitioning veterans.",
    skills: [
      "Leadership", "Strategic Planning", "Team Management", "Crisis Management",
      "Logistics", "Training & Development", "Project Management", "Communication",
      "Adaptability", "Problem Solving", "Security Clearance", "Veterans Affairs"
    ],
    educations: [
      {
        degree: "Master of Business Administration",
        school: "American Military University",
        startDate: "2018-09-01",
        endDate: "2020-05-31"
      },
      {
        degree: "Bachelor of Science in Military Science",
        school: "United States Military Academy at West Point",
        startDate: "2006-08-01",
        endDate: "2010-05-31"
      }
    ],
    workExperiences: [
      {
        position: "Battalion Commander",
        company: "U.S. Army",
        startDate: "2018-06-01",
        endDate: "2022-12-31",
        description: "Led and managed a battalion of 500+ personnel. Developed and implemented strategic plans for complex military operations. Oversaw training programs to ensure combat readiness and mission success."
      },
      {
        position: "Company Commander",
        company: "U.S. Army",
        startDate: "2014-07-01",
        endDate: "2018-05-31",
        description: "Commanded a company of 150 soldiers. Responsible for the training, welfare, and combat readiness of all personnel. Successfully led multiple overseas deployments with zero casualties."
      },
      {
        position: "Veteran Transition Coordinator",
        company: "Veterans Affairs Office",
        startDate: "2023-01-01",
        endDate: null,
        description: "Assist military veterans in their transition to civilian life. Develop and implement programs to support job placement, education opportunities, and access to benefits. Collaborate with local businesses to create employment opportunities for veterans."
      }
    ],
    certifications: [
      {
        name: "Project Management Professional (PMP)",
        issuer: "Project Management Institute",
        dateObtained: "2021-03-15"
      },
      {
        name: "Lean Six Sigma Black Belt",
        issuer: "American Society for Quality",
        dateObtained: "2020-11-30"
      }
    ]
  };

  return (
    <MilitaryTemplate resumeData={mockResumeData} />
  );
} */



















/* import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPinIcon as MapPinHouse, Phone, Medal, Award, Shield, Star, Flag } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function MilitaryTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black break-inside-avoid",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("break-inside-avoid", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          pageBreakInside: "avoid",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact"
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        
        <div 
          className="relative overflow-hidden print:overflow-visible"
          style={{ 
            background: `${resumeData.colorHex}`,
            borderBottom: `8px double ${resumeData.colorHex}90`
          }}
        >
          <div className="px-1 py-1 relative z-10">
            <PersonalInfoHeader resumeData={resumeData} />
          </div>
          
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                <Star className="w-8 h-8" />
              </div>
            ))}
          </div>


        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-3">
          
          <div className="space-y-3 print:break-inside-avoid">
            <SummarySection resumeData={resumeData} />
            <CivilianExperienceSection resumeData={resumeData} />
            <MilitaryServiceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>

          
          <div
            className="relative rounded-lg p-3 print:break-inside-avoid"
            style={{
              background: `${resumeData.colorHex}10`,
              borderLeft: `3px dashed ${resumeData.colorHex}30`,
            }}
          >
            
            <div 
              className="absolute top-4 right-4 rotate-[-20deg] opacity-10 z-0 print:opacity-10"
              style={{
                border: `2px solid ${resumeData.colorHex}`,
                padding: "0.5rem 1rem",
                color: resumeData.colorHex,
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.1em"
              }}
            >
              Confidential
            </div>

            <div className="space-y-8 print:break-inside-avoid">
              <SkillsSection resumeData={resumeData} />
              <ContactSection resumeData={resumeData} />
              <LanguageSection resumeData={resumeData} />
            </div>
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
    <div className="flex items-center gap-8 text-white">
      {photoSrc && (
        <div className="relative">
          <Image
            src={photoSrc || "/placeholder.svg"}
            width={160}
            height={160}
            alt="Profile"
            className="object-cover"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "4px",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}
          />
          
          {borderStyle !== BorderStyles.CIRCLE && (
            <>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white opacity-50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white opacity-50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white opacity-50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white opacity-50" />
            </>
          )}
          
          {borderStyle === BorderStyles.CIRCLE && (
            <div 
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: colorHex,
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <Star size={16} className="text-white" />
            </div>
          )}
        </div>
      )}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {firstName} {lastName}
        </h1>
        <p className="text-2xl mt-2 font-medium text-white opacity-90">{jobTitle}</p>
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
        <Shield size={20} style={{ color: colorHex }} />
        Mission Statement
      </h2>
      <div 
        className="p-4 text-base text-gray-600 leading-relaxed"
        style={{ 
          backgroundColor: `${colorHex}08`,
          borderLeft: `4px solid ${colorHex}`,
        }}
      >
        {summary}
      </div>
    </div>
  );
}

function MilitaryServiceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const militaryExperiences = workExperiences?.filter(
    (exp) => exp.position?.toLowerCase().includes('military') || 
             exp.company?.toLowerCase().includes('army') || 
             exp.company?.toLowerCase().includes('navy') || 
             exp.company?.toLowerCase().includes('air force') || 
             exp.company?.toLowerCase().includes('marines') ||
             exp.company?.toLowerCase().includes('coast guard')
  );

  if (!militaryExperiences?.length) return null;

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Star size={20} style={{ color: colorHex }} />
        Service Record
      </h2>
      <div className="space-y-8">
        {militaryExperiences.map((exp, index) => (
          <div 
            key={index} 
            className="relative p-4"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}30`,
              borderRadius: "4px"
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <span 
                  className="text-sm px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: `${colorHex}15`,
                    color: colorHex
                  }}
                >
                  {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium text-gray-600">{exp.company}</p>
              {exp.description && (
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CivilianExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const civilianExperiences = workExperiences?.filter(
    (exp) => !(exp.position?.toLowerCase().includes('military') || 
               exp.company?.toLowerCase().includes('army') || 
               exp.company?.toLowerCase().includes('navy') || 
               exp.company?.toLowerCase().includes('air force') || 
               exp.company?.toLowerCase().includes('marines') ||
               exp.company?.toLowerCase().includes('coast guard'))
  );

  if (!civilianExperiences?.length) return null;

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Flag size={20} style={{ color: colorHex }} />
        Civilian Experience
      </h2>
      <div className="space-y-8">
        {civilianExperiences.map((exp, index) => (
          <div 
            key={index} 
            className="relative p-4"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}30`,
              borderRadius: "4px"
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <span 
                  className="text-sm px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: `${colorHex}15`,
                    color: colorHex
                  }}
                >
                  {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
                </span>
              </div>
              <p className="text-base font-medium text-gray-600">{exp.company}</p>
              {exp.description && (
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{exp.description}</p>
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
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Award size={20} style={{ color: colorHex }} />
        Education & Training
      </h2>
      <div className="space-y-8">
        {educationsNotEmpty.map((edu, index) => (
          <div 
            key={index} 
            className="relative p-4"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}30`,
              borderRadius: "4px"
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <span 
                  className="text-sm px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: `${colorHex}15`,
                    color: colorHex
                  }}
                >
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

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Shield size={20} style={{ color: colorHex }} />
        Competencies
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="relative px-3 py-2 text-sm break-words"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}30`,
              borderRadius: "4px",
              maxWidth: "100%"
            }}
          >
            
            <div 
              className="absolute top-0 left-0 w-2 h-2"
              style={{ backgroundColor: colorHex }}
            />
            <span className="pl-1">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguageSection({ resumeData }: SectionProps) {
  const { languages, colorHex } = resumeData;

  if (!languages?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <Shield size={20} style={{ color: colorHex }} />
        Languages
      </h2>
      <div className="flex flex-wrap gap-2">
        {languages.map((language, index) => (
          <div 
            key={index}
            className="relative px-3 py-2 text-sm break-words"
            style={{ 
              backgroundColor: `${colorHex}08`,
              border: `1px solid ${colorHex}30`,
              borderRadius: "4px",
              maxWidth: "100%"
            }}
          >
            
            <div 
              className="absolute top-0 left-0 w-2 h-2"
              style={{ backgroundColor: colorHex }}
            />
            <span className="pl-1">{language}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSection({ resumeData }: SectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider" style={{ color: colorHex }}>
        <span className="w-8 h-[2px]" style={{ backgroundColor: colorHex }}></span>
        Contact Information
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
 */