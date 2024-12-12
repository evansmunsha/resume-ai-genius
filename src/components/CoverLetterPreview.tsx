import { CoverLetterValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRef } from "react";
import useDimensions from "@/hooks/useDimensions";

interface CoverLetterPreviewProps {
  coverLetterData: CoverLetterValues;
  className?: string;
  font?: string;
  style?: React.CSSProperties;
  contentRef?: React.RefObject<HTMLDivElement>;
}


export default function CoverLetterPreview({
  coverLetterData,
  className,
  font,
  style,
  contentRef
}: CoverLetterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(contentRef || containerRef);

  const styles = {
    fontFamily: font || 'sans-serif',
    backgroundColor: style?.backgroundColor || 'white',
    padding: '0.5rem',
    color: 'black',
    ...style,
  };

  return (
    <div 
      className={cn(
        "w-full h-fit print:w-[21cm] print:h-[29.7cm]",
        className
      )}
      ref={contentRef || containerRef}
      style={styles}
    >
      <div
        className={cn(!width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          ...styles,
        }}
        id="coverLetterPreviewContent"
      >
        <div className="space-y-2 print:space-y-4" style={styles}>
          <HeaderSection coverLetterData={coverLetterData} font={font} styles={styles} />
          <RecipientSection coverLetterData={coverLetterData} font={font} styles={styles} />
          <ContentSection coverLetterData={coverLetterData} font={font} styles={styles} />
          <SignatureSection coverLetterData={coverLetterData} font={font} styles={styles} />
        </div>
      </div>
    </div>
  );
} 


interface CoverLetterSectionProps {
  coverLetterData: CoverLetterValues;
  font?: string;
  styles?: React.CSSProperties;
}

 function HeaderSection({ coverLetterData, font, styles }: CoverLetterSectionProps) {
  const {firstName, lastName, jobTitle, city, email, phone, applicationLink, country, colorHex} = coverLetterData;
  
  return (
    <header className="space-y-4 break-inside-avoid flex flex-col" style={styles}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: colorHex }}>
            {firstName} {lastName}
          </h1>
          <p className="text-xl font-medium text-gray-600">{jobTitle}</p>
        </div>
        
        <div className="text-right text-sm text-gray-600 space-y-1">
          {email && <div>{email}</div>}
          {phone && <div>{phone}</div>}
          {city && country && <div>{city}, {country}</div>}
          {applicationLink && (
            <div>{applicationLink}</div>
          )}
        </div>
      </div>
      <hr className="border-t-2" style={{ borderColor: colorHex || '#000' }} />
    </header>
  );
}

function RecipientSection({ coverLetterData, font, styles }: CoverLetterSectionProps) {
  const today = format(new Date(), "MMMM d, yyyy");
  
  return (
    <div className="space-y-2 text-gray-800 break-inside-avoid" style={styles}>
      <div className="text-sm">{today}</div>
      {coverLetterData.recipientName?.[0] && (
        <div className="space-y-1">
          <p className="text-sm">To:</p>
          <p className="font-medium">{coverLetterData.recipientName[0].recipientName}</p>
          <p>{coverLetterData.recipientName[0].recipientTitle}</p>
          <p>{coverLetterData.recipientName[0].companyName}</p>
          <p>{coverLetterData.recipientName[0].jobTitle}</p>
          {coverLetterData.recipientName[0].jobReference && (
            <p className="text-sm text-gray-600">Ref: {coverLetterData.recipientName[0].jobReference}</p>
          )}
        </div>
      )}
    </div>
  );
}

function ContentSection({ coverLetterData, font, styles }: CoverLetterSectionProps) {
  const recipientName = coverLetterData.recipientName?.[0]?.recipientName;
  const { colorHex } = coverLetterData;
  
  return (
    <div className="space-y-2 text-gray-800 leading-relaxed" style={styles}>
      {/* Opening */}
      {coverLetterData.opening && (
        <>
          <div className="break-inside-avoid" style={{ color: colorHex }}>
            Dear {recipientName ? recipientName : "Sir/Madam"},
          </div>
          <div className="whitespace-pre-wrap break-inside-avoid">{coverLetterData.opening}</div>
        </>
      )}

      {/* Experience Details */}
      {coverLetterData.experience && (
        <div className="whitespace-pre-wrap break-inside-avoid">{coverLetterData.experience}</div>
      )}


      {/* Skills */}
      {(coverLetterData.skills ?? []).length > 0 && (
        <div className="space-y-1 break-inside-avoid">
          <ul className="list-disc pl-5 space-y-1">
            {(coverLetterData.skills ?? []).map((skill, index) => (
              <li key={index} className="text-gray-700">{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {(coverLetterData.achievements ?? []).length > 0 && (
        <div className="space-y-2 break-inside-avoid">
          
          {(coverLetterData.achievements ?? []).map((achievement, index) => (
            <div key={index} className="text-gray-700">
              <strong>{achievement.description}</strong> - {achievement.impact} ({achievement.date})
            </div>
          ))}
        </div>
      )}

      {/* Company Knowledge */}
      {coverLetterData.companyKnowledge && (
        <div className="whitespace-pre-wrap break-inside-avoid">{coverLetterData.companyKnowledge}</div>
      )}

      {/* Future Plans */}
      {coverLetterData.futurePlans && (
        <div className="whitespace-pre-wrap break-inside-avoid">{coverLetterData.futurePlans}</div>
      )}

      {/* Closing */}
      {coverLetterData.closing && (
        <div className="whitespace-pre-wrap break-inside-avoid">{coverLetterData.closing}</div>
      )}
    </div>
  );
}

function SignatureSection({ coverLetterData, font, styles }: CoverLetterSectionProps) {
  const { colorHex } = coverLetterData;
  return (
    <div className="mt-5 break-inside-avoid" style={styles}>
      <p className="text-gray-700">Sincerely,</p>
      <p className="font-medium text-gray-900" style={{color: colorHex}}>
        {coverLetterData.firstName} {coverLetterData.lastName}
      </p>
    </div>
  );
} 

