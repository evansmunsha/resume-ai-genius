import { EditorFormProps } from "@/lib/types/types";
import YourInfoForm from "./forms/YourInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import RecipientInfoForm from "./forms/RecipientInfoForm";
import AchievementForm from "./forms/AchievementForm";
import SkillsForm from "./forms/SkillsForm";
import OpeningForm from "./forms/OpeningForm";
import ExperienceForm from "./forms/ExperienceForm";
import CompanyKnowledgeForm from "./forms/CompanyKnowledgeForm";
import FuturePlansForm from "./forms/FuturePlansForm";
import ClosingForm from "./forms/ClosingForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General Info", component: YourInfoForm, key: "general-info" },
  { title: "Your Info", component: PersonalInfoForm, key: "personal-info" },
  { title: "Recipient", component: RecipientInfoForm, key: "recipient-info" },
  { title: "Opening", component: OpeningForm, key: "opening" },
  { title: "Experience", component: ExperienceForm, key: "experience-details" },
  { title: "Skills", component: SkillsForm, key: "skills" },
  { title: "Achievements", component: AchievementForm, key: "achievements" },
  { title: "Company Knowledge", component: CompanyKnowledgeForm, key: "company-knowledge" },
  { title: "Future Plans", component: FuturePlansForm, key: "future-plans" },
  { title: "Closing", component: ClosingForm, key: "closing" },
];
