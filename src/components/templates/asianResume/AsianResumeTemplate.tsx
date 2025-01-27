import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { MailMinus, MapPinHouseIcon, Phone } from "lucide-react";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function AsianResumeTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn("p-4", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        
        <div className="mt-4 space-y-3">
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
          <LanguageSection resumeData={resumeData} />
          <CertificationsSection resumeData={resumeData} />
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

  // Simulated personal seal/chop
  const PersonalSeal: React.FC = () => (
    <div className="w-20 h-20 border-2  rounded-full flex items-center justify-center text-xs font-bold" style={{ borderColor: colorHex, color: colorHex }}>
      {firstName?.charAt(0)}{lastName?.charAt(0)}
    </div>
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {photoSrc && (
              <Image
                src={photoSrc || "/placeholder.svg?height=120&width=120"}
                width={120}
                height={120}
                alt="Profile"
                className="object-cover"
                style={{
                  borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                              borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
                }}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: colorHex }}>
                {lastName} {firstName}
              </h1>
              <p className="text-lg mt-1">{jobTitle}</p>
              {(!phone || !email || !city || !country) ? null : (
                <div className="mt-2 text-sm space-y-1 flex items-center gap-1">
                  <p className="flex items-center gap-1"><Phone size={15}/>{phone}</p>
                  <p className="flex items-center gap-1"><MailMinus size={15}/>{email}</p>
                  <p className="flex items-center gap-1"><MapPinHouseIcon size={15}/>{[city, country].filter(Boolean).join(", ")}</p>
                </div>
              )}
            </div>
          </div>
          {(!lastName || !firstName) ? null : (
            <PersonalSeal />
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
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Professional Summary</h2>
        <p className="text-sm">{summary}</p>
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
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Education</h2>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between">
              <h3 className="font-medium">{edu.school}</h3>
              {edu.startDate && (
                <p className="text-sm">
                  {formatDate(edu.startDate, "yyyy.MM")} - {edu.endDate ? formatDate(edu.endDate, "yyyy.MM") : "Present"}
                </p>
              )}
            </div>
            <p className="text-sm">{edu.degree}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const experiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!experiencesNotEmpty?.length) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Work Experience</h2>
        {experiencesNotEmpty.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{exp.company}</h3>
              {exp.startDate && (
                <p className="text-sm">
                  {formatDate(exp.startDate, "yyyy.MM")} - {exp.endDate ? formatDate(exp.endDate, "yyyy.MM") : "Present"}
                </p>
              )}
            </div>
            <p className="text-sm font-medium">{exp.position}</p>
            <p className="text-sm mt-1">{exp.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Skills</h2>
        <ul className="list-disc list-inside text-sm">
          {skills.map((skill, index) => (
            <li key={index} className="mb-1">{skill}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function LanguageSection({ resumeData }: SectionProps) {
  const { skills, colorHex } = resumeData;

  const languages = skills?.filter(skill => 
    ["english", "chinese", "japanese", "korean"].some(lang => 
      skill.toLowerCase().includes(lang)
    )
  );

  if (!languages?.length) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Language Skills</h2>
        <ul className="list-disc list-inside text-sm">
          {languages.map((language, index) => (
            <li key={index} className="mb-1">{language}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CertificationsSection({ resumeData }: SectionProps) {
  const { skills, colorHex, } = resumeData;

  const certifications = skills?.filter(skill => 
    skill.toLowerCase().includes('certification') ||
    skill.toLowerCase().includes('certificate')
  );

  if (!certifications?.length) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: colorHex }}>Certifications</h2>
        <ul className="list-disc list-inside text-sm">
          {certifications.map((cert, index) => (
            <li key={index} className="mb-1">{cert}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
