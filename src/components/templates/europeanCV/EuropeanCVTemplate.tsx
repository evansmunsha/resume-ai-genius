import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPinHouse, Phone } from "lucide-react";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function EuropeanCVTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black shadow-lg", className)}
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
          className="border-b-2 bg-gradient-to-r from-white to-gray-50" 
          style={{ borderColor: resumeData.colorHex }}
        >
          <div className="px-8 py-6">
            <PersonalInfoHeader resumeData={resumeData} />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            <SummarySection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
          </div>
          <div className="space-y-6">
            <SkillsSection resumeData={resumeData} />
            <ContactSection resumeData={resumeData} />
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
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {photoSrc && (
        <div className="relative">
          <Image
            src={photoSrc}
            width={120}
            height={120}
            alt="Profile"
            className="aspect-square object-cover shadow-md transition-transform duration-300 hover:scale-105"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "4px",
              borderColor: colorHex,
              borderWidth: "2px"
            }}
          />
        </div>
      )}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: colorHex }}>
          {firstName} {lastName}
        </h1>
        <p className="text-xl mt-2 text-gray-600 font-medium">{jobTitle}</p>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colorHex }}>
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colorHex }}>
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${colorHex}15`,
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

function ContactSection({ resumeData }: SectionProps) {
  const { email, phone, colorHex, city, country } = resumeData;

  if (!email || !phone || !city || !country) return null;

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colorHex }}>
          Contact Information
        </h2>
        <div className="space-y-3">
          {email && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium"><Mail/></span>
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium"><Phone/></span>
              <span>{phone}</span>
            </div>
          )}
          {(city || country) && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium"><MapPinHouse/></span>
              <span>{[city, country].filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>
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
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colorHex }}>
          Experience
        </h2>
        <div className="space-y-6">
          {experiencesNotEmpty.map((exp, index) => (
            <div key={index} className="relative pl-4 border-l-2" style={{ borderColor: `${colorHex}50` }}>
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <p className="text-gray-600 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {exp.startDate ? formatDate(new Date(exp.startDate), "MMM yyyy") : ""} -{" "}
                  {exp.endDate
                    ? formatDate(new Date(exp.endDate), "MMM yyyy")
                    : "Present"}
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
