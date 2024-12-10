"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { Layout } from "lucide-react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import { coverLetterTemplates } from "@/lib/templates";

interface TemplateSelectorProps {
  currentTemplate: string;
  onTemplateChange: (template: string) => void;
}

export default function TemplateSelector({
  currentTemplate,
  onTemplateChange,
}: TemplateSelectorProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();

  const handleTemplateChange = (templateId: string) => {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }
    onTemplateChange(templateId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          title="Change cover letter template"
          onClick={(e) => {
            if (!canUseCustomizations(subscriptionLevel)) {
              e.preventDefault();
              premiumModal.setOpen(true);
              return;
            }
          }}
        >
          <Layout className="h-4 w-4" />
          Template
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {coverLetterTemplates.map((template) => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => handleTemplateChange(template.id)}
            className={currentTemplate === template.id ? "bg-accent" : ""}
          >
            {template.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 