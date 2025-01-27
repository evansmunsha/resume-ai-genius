import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, GraduationCap, Award, Globe, Mail, Phone, MapPin, Linkedin } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export function CorporateTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-gray-800",
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
        <main className="p-8 space-y-6 print:break-inside-avoid">
          <HeaderSection resumeData={resumeData} />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <SummarySection resumeData={resumeData} />
              <WorkExperienceSection resumeData={resumeData} />
              <EducationSection resumeData={resumeData} />
            </div>
            <div className="space-y-6">
              <SkillsSection resumeData={resumeData} />
              <CertificationsSection resumeData={resumeData} />
              <LanguagesSection resumeData={resumeData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function HeaderSection({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <header className="flex items-center space-x-6 pb-4 border-b border-gray-300">
      {photoSrc && (
        <div className="flex-shrink-0">
          <Image
            src={photoSrc || "/placeholder.svg?height=120&width=120"}
            width={120}
            height={120}
            alt="Profile"
            className="object-cover"
            style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "8px",
            }}
          />
        </div>
      )}
      <div className="flex-grow space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {firstName} {lastName}
        </h1>
        <p className="text-xl text-gray-600">{jobTitle}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {[city, country].filter(Boolean).length > 0 && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{[city, country].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span>{email}</span>
            </div>
          )}
          <div className="flex items-center">
            <Linkedin className="w-4 h-4 mr-1" />
            <span>linkedin.com/in/yourprofile</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold text-gray-800">Professional Summary</h2>
      <Separator className="bg-gray-300" />
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </section>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
      <Separator className="bg-gray-300" />
      {workExperiences.map((exp, index) => (
        <Card key={index} className="bg-gray-50">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <p className="text-sm text-gray-500">
                {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
              </p>
            </div>
            {exp.description && (
              <p className="text-gray-700 text-sm">{exp.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function EducationSection({ resumeData }: SectionProps) {
  const { educations } = resumeData;

  if (!educations?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Education</h2>
      <Separator className="bg-gray-300" />
      {educations.map((edu, index) => (
        <div key={index} className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
            <p className="text-gray-600">{edu.school}</p>
          </div>
          <p className="text-sm text-gray-500">
            {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
            {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
          </p>
        </div>
      ))}
    </section>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
      <Separator className="bg-gray-300" />
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-gray-700 bg-gray-200">
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications } = resumeData;

  if (!certifications?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Certifications</h2>
      <Separator className="bg-gray-300" />
      {certifications.map((cert, index) => (
        <div key={index} className="flex items-start space-x-2">
          <Award className="w-5 h-5 text-gray-600 mt-1" />
          <div>
            <p className="font-medium text-gray-800">{cert.name}</p>
            <p className="text-sm text-gray-600">{cert.issuer}</p>
            {cert.dateObtained && (
              <p className="text-sm text-gray-500">
                {formatDate(new Date(cert.dateObtained), "MMM yyyy")}
              </p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages } = resumeData;

  if (!languages?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Languages</h2>
      <Separator className="bg-gray-300" />
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-gray-800">{lang}</span>
            <span className="text-sm text-gray-600">- {lang}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
