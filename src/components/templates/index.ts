import { TemplateProps } from "./BaseTemplate";
import { ModernTemplate } from "./modern/ModernTemplate";
import { ProfessionalTemplate } from "./professional/ProfessionalTemplate";
import { MinimalTemplate } from "./minimal/MinimalTemplate";
import { TraditionalTemplate } from "./traditional/TraditionalTemplate";
import { CreativeTemplate } from "./creative/CreativeTemplate";
import { StartupTemplate } from "./startup/StartupTemplate";
import { CorporateTemplate } from "./corporate/CorporateTemplate";
import { ExecutiveTemplate } from "./executive/ExecutiveTemplate";
import DigitalTemplate from "./digital/DigitalTemplate";
import CompactTemplate from "./compact/CompactTemplate";
import InfographicTemplate from "./infographic/InfographicTemplate";
import MinimalistTemplate from "./minimalist/MinimalistTemplate";
import ATSTemplate from "./ats/ATSTemplate";
import ChronologicalTemplate from "./chronological/ChronologicalTemplate";
import { FunctionalTemplate } from "./functional/FunctionalTemplate";
import { HybridTemplate } from "./hybrid/HybridTemplate";
import { ModernProfessionalTemplate } from "./modern-professional/ModernProfessionalTemplate";
import { DistinctiveTemplate } from "./distinctive/DistinctiveTemplate";
import { TechIndustryTemplate } from "./techIndustry/TechIndustryTemplate";
import { FinanceTemplate } from "./finance/FinanceTemplate";
import { CreativeIndustryTemplate } from "./creativeIndustry/CreativeIndustryTemplate";
import { SalesMarketingTemplate } from "./salesMarketing/SalesMarketingTemplate";
import { RemoteWorkTemplate } from "./remoteWork/RemoteWorkTemplate";
import { EcoFriendlyTemplate } from "./ecoFriendly/EcoFriendlyTemplate";
import { MilitaryTemplate } from "./military/MilitaryTemplate";
import { GovernmentTemplate } from "./government/GovernmentTemplate";
import { StartupPitchTemplate } from "./startupPitch/StartupPitchTemplate";
import { AsianResumeTemplate } from "./asianResume/AsianResumeTemplate";
import { PhotoIntegratedTemplate } from "./photoIntegrated/PhotoIntegratedTemplate";
import HealthcareTemplate from "./healthcare/HealthcareTemplate";
import { EuropeanCVTemplate } from "./europeanCV/EuropeanCVTemplate";
import { CombinedAcademicTemplate } from "./academic/CombinedAcademicTemplate";
import { MidCareerProfessionalTemplate } from "./portfolio/MidCareerProfessionalTemplate";

export type TemplateId = keyof typeof templates;

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  component: React.ComponentType<TemplateProps>;
  availability: "free" | "pro" | "enterprise";
}

export const templates = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    component: ModernTemplate,
    availability: "free"
  },
  digital: {
    id: "digital",
    name: "Digital",
    description: "Modern tech-focused design",
    component: DigitalTemplate,
    availability: "enterprise"
  },
  professional: {
    id: "professional",
    name: "Professional",
    description: "Traditional business style",
    component: ProfessionalTemplate,
    availability: "enterprise"
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    component: MinimalTemplate,
    availability: "free"
  },
  traditional: {
    id: "traditional",
    name: "Traditional",
    description: "Classic format",
    component: TraditionalTemplate,
    availability: "enterprise"
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Professional corporate layout",
    component: CorporateTemplate,
    availability: "enterprise"
  },
  executive: {
    id: "executive",
    name: "Executive",
    description: "Distinguished leadership style",
    component: ExecutiveTemplate,
    availability: "enterprise"
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Bold design for creatives",
    component: CreativeTemplate,
    availability: "pro"
  },
  startup: {
    id: "startup",
    name: "Startup",
    description: "Modern tech style",
    component: StartupTemplate,
    availability: "pro"
  },
  academic: {
    id: "academic",
    name: "Academic",
    description: "Research-focused layout",
    component: CombinedAcademicTemplate,
    availability: "enterprise"
  },
  compact: {
    id: "compact",
    name: "Compact",
    description: "Space-efficient minimal design",
    component: CompactTemplate,
    availability: "enterprise"
  },
  infographic: {
    id: "infographic",
    name: "Infographic",
    description: "Visual timeline design",
    component: InfographicTemplate,
    availability: "enterprise"
  },
  portfolio: {
    id: "MidCareerProfessional",
    name: "MidCareerProfessional",
    description: "Creative professional design",
    component: MidCareerProfessionalTemplate,
    availability: "enterprise"
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean typography focused design",
    component: MinimalistTemplate,
    availability: "pro"
  },
  ats: {
    id: "ats",
    name: "ATS-Friendly",
    description: "Optimized for applicant tracking systems",
    component: ATSTemplate,
    availability: "free"
  },
  chronological: {
    id: "chronological",
    name: "Chronological",
    description: "Timeline-based career progression",
    component: ChronologicalTemplate,
    availability: "pro"
  },
  functional: {
    id: "functional",
    name: "Functional",
    description: "Skills-focused format",
    component: FunctionalTemplate,
    availability: "pro"
  },
  hybrid: {
    id: "hybrid",
    name: "Hybrid",
    description: "Best of chronological and functional formats",
    component: HybridTemplate,
    availability: "pro"
  },
  modernProfessional: {
    id: "modernProfessional",
    name: "Modern Professional",
    description: "Contemporary side column design",
    component: ModernProfessionalTemplate,
    availability: "pro"
  },
  distinctive: {
    id: "distinctive",
    name: "Distinctive",
    description: "Bold borders and modern layout",
    component: DistinctiveTemplate,
    availability: "pro"
  },
  modernTemplate: {
    id: "modernTemplate",
    name: "Modern Template",
    description: "Professional three-column layout with gradient accents",
    component: ModernTemplate,
    availability: "enterprise"
  },
  techIndustry: {
    id: "techIndustry",
    name: "Tech Industry",
    description: "Highlights technical skills, certifications, and projects",
    component: TechIndustryTemplate,
    availability: "pro"
  },
   healthcare: {
    id: "healthcare",
    name: "Healthcare",
    description: "Focused on clinical experience and patient care",
    component: HealthcareTemplate,
    availability: "pro"
  },
  finance: {
    id: "finance",
    name: "Finance",
    description: "Emphasizes financial achievements and certifications",
    component: FinanceTemplate,
    availability: "pro"
  },
  creativeIndustry: {
    id: "creativeIndustry",
    name: "Creative Industry",
    description: "Design-focused template with portfolio integration",
    component: CreativeIndustryTemplate,
    availability: "pro"
  },
 salesMarketing: {
    id: "salesMarketing",
    name: "Sales and Marketing",
    description: "Metrics-driven design highlighting achievements",
    component: SalesMarketingTemplate,
    availability: "pro"
  },
   remoteWork: {
    id: "remoteWork",
    name: "Remote Work",
    description: "Showcases remote work skills and collaboration tools",
    component: RemoteWorkTemplate,
    availability: "pro"
  },
  ecoFriendly: {
    id: "ecoFriendly",
    name: "Green Industry",
    description: "Focuses on sustainability projects and initiatives",
    component: EcoFriendlyTemplate,
    availability: "pro"
  },
 military: {
    id: "military",
    name: "Military-to-Civilian",
    description: "Transition-focused template for veterans",
    component: MilitaryTemplate,
    availability: "pro"
  },
   government: {
    id: "government",
    name: "Government",
    description: "Standardized format for public sector jobs",
    component: GovernmentTemplate,
    availability: "enterprise"
  },
  startupPitch: {
    id: "startupPitch",
    name: "Startup Pitch",
    description: "Resume and portfolio combined for startup professionals",
    component: StartupPitchTemplate,
    availability: "pro"
  },
  europeanCV: {
    id: "europeanCV",
    name: "European CV",
    description: "Adheres to EU-style CV formatting",
    component: EuropeanCVTemplate,
    availability: "enterprise"
  },
  asianResume: {
    id: "asianResume",
    name: "Asian Resume",
    description: "Concise, region-specific one-page format",
    component: AsianResumeTemplate,
    availability: "pro"
  },
  photoIntegrated: {
    id: "photoIntegrated",
    name: "Photo-Integrated",
    description: "Includes professional photo sections",
    component: PhotoIntegratedTemplate,
    availability: "enterprise"
  },
} as const;