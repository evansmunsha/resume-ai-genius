import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Globe, } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export default function InfographicTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800",
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
        <main className="p-4 space-y-2 print:break-inside-avoid">
          <HeaderSection resumeData={resumeData} />
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <TimelineSection resumeData={resumeData} />
            </div>
            <div className="space-y-2">
              <SkillsSection resumeData={resumeData} />
              {/* <CertificationsSection resumeData={resumeData} /> */}
              <LanguagesSection resumeData={resumeData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function HeaderSection({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, summary, borderStyle, colorHex } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <header className="flex items-center space-x-8 bg-white rounded-lg shadow-md p-6">
      {photoSrc && (
        <div className="flex-shrink-0">
          <Image
            src={photoSrc || "/placeholder.svg?height=150&width=150"}
            width={150}
            height={150}
            alt="Profile"
            className="object-cover"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "16px",
            }}
          />
        </div>
      )}
      <div className="flex-grow space-y-2">
        <h1 className="text-4xl font-bold " style={{ color: colorHex }}>
          {firstName} {lastName}
        </h1>
        <p className="text-2xl text-gray-600">{jobTitle}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {[city, country].filter(Boolean).length > 0 && (
            <span>{[city, country].filter(Boolean).join(", ")}</span>
          )}
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
        </div>
        {summary && (
          <p className="text-sm leading-relaxed max-w-2xl">{summary}</p>
        )}
      </div>
    </header>
  );
}

function TimelineSection({ resumeData }: SectionProps) {
  const { workExperiences, educations, colorHex } = resumeData;
  const timelineItems = [
    ...(workExperiences || []).map(exp => ({ ...exp, type: 'work' })),
    ...(educations || []).map(edu => ({ ...edu, type: 'education' }))
  ].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0; // Default to 0 if invalid
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0; // Default to 0 if invalid
    return dateB - dateA;
  });

  // Type guard to check if item is a work experience
  const isWorkExperience = (item: any): item is { position: string; type: string; startDate?: string | null; endDate?: string | null; } => {
    return item.type === 'work' && typeof item.position === 'string';
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 " style={{ color: colorHex }}></div>
      {timelineItems.map((item, index) => (
        <div key={index} className="relative pl-12 pb-3">
          <div className="absolute left-0 top-0 bg-indigo-500 rounded-full w-8 h-8 flex items-center justify-center">
            {item.type === 'work' ? <Briefcase className="w-4 h-4 text-white" /> : <GraduationCap className="w-4 h-4 text-white" />}
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-lg font-semibold" style={{ color: colorHex }}>
              {isWorkExperience(item) ? item.position : item.description}
            </h3>
            <p className="text-gray-600">{item.type === 'work' ? item.startDate : item.description}</p>
            <p className="text-sm text-gray-500">
              {item.startDate ? formatDate(new Date(item.startDate), "MMM yyyy") : "Invalid Date"} - {item.endDate ? formatDate(new Date(item.endDate), "MMM yyyy") : "Present"}
            </p>
            {item.type === 'work' && item.description && (
              <p className="mt-2 text-sm">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: colorHex }}>Skills</h2>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{skill}</span>
              <span className="text-sm text-gray-600">{Math.floor(Math.random() * 50) + 70}%</span>
            </div>
            <Progress value={Math.floor(Math.random() * 50) + 70} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications } = resumeData;

  if (!certifications?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Certifications</h2>
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Award className="w-5 h-5 text-indigo-500 mt-1" />
            <div>
              <p className="font-medium">{cert.name}</p>
              <p className="text-sm text-gray-600">{cert.issuer}</p>
              {cert.dateObtained && (
                <p className="text-sm text-gray-500">
                  {formatDate(new Date(cert.dateObtained), "MMM yyyy")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} */

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages, colorHex } = resumeData;

  if (!languages?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: colorHex }}>Languages</h2>
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <Badge key={index} variant="outline" className="text-sm py-1 px-2">
            <Globe className="w-4 h-4 mr-1" />
            {lang} - {lang}
          </Badge>
        ))}
      </div>
    </div>
  );
}
