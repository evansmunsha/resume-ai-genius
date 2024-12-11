"use client"

import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

interface ColorThemeSelectorProps {
  Color: Color | undefined;
  onChange: ColorChangeHandler;
}

export default function ColorThemeSelector({
  Color,
  onChange,
}: ColorThemeSelectorProps) {
  const [showPopover, setShowPopover] = useState(false);
  const { theme } = useTheme();
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2" 
          title="Change cover letter color"
          onClick={() => {
            if (!canUseCustomizations(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(!showPopover);
          }}
        >
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className={cn(
          "border-none shadow-none",
          theme === "dark" ? "bg-transparent" : "bg-transparent"
        )}
      >
        <TwitterPicker 
          color={Color} 
          onChange={onChange} 
          triangle="top-right"
          styles={{
            default: {
              card: {
                backgroundColor: theme === "dark" ? "#000" : "#fff",
              }
            }
          }} 
        />
      </PopoverContent>
    </Popover>
  );
} 