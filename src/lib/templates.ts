import { AcademicTemplate } from "@/components/templates/academic/AcademicTemplate";
import { CreativeTemplate } from "@/components/templates/creative/CreativeTemplate";
import { MinimalTemplate } from "@/components/templates/minimal/MinimalTemplate";
import { ModernTemplate } from "@/components/templates/modern/ModernTemplate";
import { ProfessionalTemplate } from "@/components/templates/professional/ProfessionalTemplate";
import { StartupTemplate } from "@/components/templates/startup/StartupTemplate";
import { TraditionalTemplate } from "@/components/templates/traditional/TraditionalTemplate";

export const templates = {
  modern: {
    name: "Modern",
    component: ModernTemplate,
    description: "Clean and contemporary design with a two-column layout"
  },
  professional: {
    name: "Professional",
    component: ProfessionalTemplate,
    description: "Traditional business style with a polished look"
  },
  minimal: {
    name: "Minimal",
    component: MinimalTemplate,
    description: "Simple and elegant with focus on content"
  },
  creative: {
    name: "Creative",
    component: CreativeTemplate,
    description: "Bold design for creative professionals"
  },
  startup: {
    name: "Startup",
    component: StartupTemplate,
    description: "Dynamic layout emphasizing achievements and impact"
  },
  academic: {
    name: "Academic",
    component: AcademicTemplate,
    description: "Formal design for academic and research positions"
  },
  traditional: {
    name: "Traditional",
    component: TraditionalTemplate,
    description: "Classic format with timeless appeal"
  }
} as const;

export type TemplateId = keyof typeof templates;
