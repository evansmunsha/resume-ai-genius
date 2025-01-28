import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap, Globe, Palette, Camera, Code, Music,} from 'lucide-react';
import React from "react";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export  function CreativeTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 text-gray-800",
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
        <main className="p-3 space-y-2 print:break-inside-avoid">
          <HeaderSection resumeData={resumeData} />
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <WorkExperienceSection resumeData={resumeData} />
              <EducationSection resumeData={resumeData} />
              <ProjectsSection resumeData={resumeData} />
            </div>
            <div className="space-y-2">
              <SkillsSection resumeData={resumeData} />{/* 
              <CertificationsSection resumeData={resumeData} /> */}
              <LanguagesSection resumeData={resumeData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function HeaderSection({ resumeData }: SectionProps) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, summary, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  
  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);
  
  if (!email?.length || !phone?.length || !city?.length || !country?.length) return null;


  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10 flex items-center space-x-8">
        {photoSrc && (
          <div className="flex-shrink-0">
            <Image
              src={photoSrc || "/placeholder.svg?height=200&width=200"}
              width={200}
              height={200}
              alt="Profile"
              className="object-cover"
              style={{
                borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                            borderStyle === BorderStyles.CIRCLE ? "9999px" : "16px",
              }}
            />
          </div>
        )}
        <div className="flex-grow space-y-4">
          <h1 className="text-5xl font-bold">
            {firstName} <span className="text-yellow-300">{lastName}</span>
          </h1>
          <p className="text-2xl font-light">{jobTitle}</p>
          <div className="flex flex-wrap gap-4 text-sm">
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
      </div>
    </header>
  );
}

function WorkExperienceSection({ resumeData }: SectionProps) {
  const { workExperiences } = resumeData;

  if (!workExperiences?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-purple-600">Work Experience</h2>
      {workExperiences.map((exp, index) => (
        <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
            </div>
            <p className="text-gray-600">{exp.company}</p>
            <p className="text-sm text-gray-500">
              {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
              {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
            </p>
            {exp.description && (
              <p className="text-sm text-gray-700">{exp.description}</p>
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
      <h2 className="text-3xl font-bold text-pink-600">Education</h2>
      {educations.map((edu, index) => (
        <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
            </div>
            <p className="text-gray-600">{edu.school}</p>
            <p className="text-sm text-gray-500">
              {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
              {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function ProjectsSection({ resumeData }: SectionProps) {
  // For this example, we'll use workExperiences to showcase projects
  const { workExperiences } = resumeData;

  if (!workExperiences?.length) return null;

  const projectIcons = [Palette, Camera, Code, Music];

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-red-600">Featured Projects</h2>
      <div className="grid grid-cols-2 gap-4">
        {workExperiences.slice(0, 4).map((project, index) => (
          <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center space-x-2">
                {React.createElement(projectIcons[index % projectIcons.length], { className: "w-5 h-5 text-yellow-500" })}
                <h3 className="text-lg font-semibold text-gray-800">{project.position}</h3>
              </div>
              <p className="text-sm text-gray-600">{project.company}</p>
              <p className="text-sm text-gray-700">{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  const getRandomColor = () => {
    const colors = ['bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-yellow-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-yellow-600">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} className={`${getRandomColor()} text-white px-3 py-1 text-sm font-medium`}>
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  );
}

/* function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications } = resumeData;

  if (!certifications?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-purple-600">Certifications</h2>
      <div className="space-y-2">
        {certifications.map((cert, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Award className="w-5 h-5 text-pink-500 mt-1" />
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
      </div>
    </section>
  );
}
 */
function LanguagesSection({ resumeData }: SectionProps) {
  const { languages } = resumeData;

  if (!languages?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-red-600">Languages</h2>
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-800">{lang}</span>
            <span className="text-sm text-gray-600">- {lang}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
