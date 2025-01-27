
import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@/hooks/useDimensions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface TemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface SectionProps {
  resumeData: ResumeValues;
}

export default function CompactTemplate({ resumeData, contentRef, className }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div 
      className={cn("aspect-[210/297] h-fit w-full bg-white text-black", className)}
      ref={containerRef}
    >
      <div
        className={cn("p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        id="resumePreviewContent"
        ref={contentRef}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        
        <div className="mt-4 space-y-4">
          <SummarySection resumeData={resumeData} />
          <ExperienceSection resumeData={resumeData} />
          <div className="grid grid-cols-2 gap-4">
            <EducationSection resumeData={resumeData} />
            <SkillsSection resumeData={resumeData} />
          </div>
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

  return (
    <div className="flex border-b pb-2 items-center gap-6" style={{ borderColor: colorHex }}>
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "9999px"
                  : "10%",
          }}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p
            className="text-3xl font-bold"
            style={{
              color: colorHex,
            }}
          >
            {firstName} {lastName}
          </p>
          <p
            className="font-medium"
            style={{
              color: colorHex,
            }}
          >
            {jobTitle}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: SectionProps) {
  const { summary,colorHex } = resumeData;

  if (!summary) return null;

  return (
    <Card>
      <CardContent className="p-3">
      <h2 className="text-l text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: colorHex }}>
        Professional Summary
      </h2>
        <p className="text-xs text-gray-600 leading-tight">{summary}</p>
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
      <CardContent className="p-3 space-y-3">
        <h2 className="text-l text-sm font-semibold uppercase tracking-wide" style={{ color: colorHex }}>Experience</h2>
        {experiencesNotEmpty.map((exp, index) => (
          <div key={index} className="text-xs space-y-1">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="font-medium">{exp.position}</span>
                <span className="text-gray-500"> at {exp.company}</span>
              </div>
              {exp.startDate && (
                <span className="text-gray-400">
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            <p className="text-gray-600 leading-tight">{exp.description}</p>
          </div>
        ))}
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
      <CardContent className="p-3 space-y-3">
        <h2 className="text-l text-sm font-semibold uppercase tracking-wide" style={{ color: colorHex }}>Education</h2>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="text-xs space-y-1">
            <div className="font-medium">{edu.degree}</div>
            <div className="text-gray-600">{edu.school}</div>
            {edu.startDate && (
              <div className="text-gray-400">
                {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SkillsSection({ resumeData }: SectionProps) {
  const { skills, colorHex ,borderStyle} = resumeData;

  if (!skills?.length) return null;

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: colorHex }}>Skills</h2>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, index) => (
            <Badge key={index}  className={colorHex === "text-xs text-white" ? colorHex : " bg-white border-neutral-950"} style={{
              borderRadius: borderStyle === BorderStyles.SQUARE ? "0" : 
                          borderStyle === BorderStyles.CIRCLE ? "9999px" : "10%",
                          color: colorHex
            }}>
              • {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}