import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Briefcase, GraduationCap, Award, Globe, Mail, Phone, MapPin, Linkedin, Github, Twitter } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export default function DigitalTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-gray-100 text-gray-800",
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
        <main className="p-2 space-y-2 print:break-inside-avoid">
          <HeaderSection resumeData={resumeData} />
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <SummarySection resumeData={resumeData} />
              <WorkExperienceSection resumeData={resumeData} />
              <ProjectsSection resumeData={resumeData} />
              <EducationSection resumeData={resumeData} />
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
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <header className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-md">
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
        <p className="text-xl text-blue-600">{jobTitle}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
        </div>
      </div>
    </header>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Professional Summary</h2>
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
      {workExperiences.map((exp, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <Badge variant="outline" className="text-sm">
                {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : "Present"}
              </Badge>
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

function ProjectsSection({ resumeData }: SectionProps) {
  // For this example, we'll use the first two work experiences as projects
  const projects = resumeData.workExperiences?.slice(0, 2);

  if (!projects?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Key Projects</h2>
      {projects.map((project, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-lg font-semibold text-blue-600">{project.position}</h3>
            <p className="text-gray-700 text-sm">{project.description}</p>
            <div className="flex gap-2">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Node.js</Badge>
              <Badge variant="secondary">AWS</Badge>
            </div>
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
      {educations.map((edu, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-blue-600">{edu.degree}</h3>
              <p className="text-gray-600">{edu.school}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {edu.startDate && formatDate(new Date(edu.startDate), "yyyy")} -{" "}
              {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : "Present"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Technical Skills</h2>
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">{skill}</span>
              <span className="text-sm text-gray-500">{Math.floor(Math.random() * 41) + 60}%</span>
            </div>
            <Progress value={Math.floor(Math.random() * 41) + 60} className="h-2" />
          </div>
        ))}
      </div>
    </section>
  );
}
/* 
function CertificationsSection({ resumeData }: SectionProps) {
  const { certifications } = resumeData;

  if (!certifications?.length) return null;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Certifications</h2>
      {certifications.map((cert, index) => (
        <div key={index} className="flex items-start space-x-2">
          <Award className="w-5 h-5 text-blue-600 mt-1" />
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
} */

function LanguagesSection({ resumeData }: SectionProps) {
  const { languages } = resumeData;

  if (!languages?.length) return null;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Languages</h2>
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700">{lang}</span>
            <Badge variant="secondary">{lang}</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}

