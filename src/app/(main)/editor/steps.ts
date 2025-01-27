import GeneralInfoForm from './forms/GeneralInfoForm'
import PersonalInfoForm from './forms/PersonalInfoForm'
import SummaryForm from './forms/SummaryForm'
import WorkExperienceForm from './forms/WorkExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import TemplateStep from './steps/TemplateStep'
import LanguageForm from './forms/LanguageForm'


interface Step {
  title: string;
  component: React.ComponentType<any>;
  key: string;
}

export const steps: Step[] = [
  { title: "Choose Template", component: TemplateStep, key: "template" },
  { title: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
  { title: "Work Experience", component: WorkExperienceForm, key: "work-experience" },
  { title: "Education", component: EducationForm, key: "education" },
  { title: "Skills", component: SkillsForm, key: "skills" },
  { title: "Languages", component: LanguageForm, key: "languages" },
  
  { title: "Summary", component: SummaryForm, key: "summary" },
];