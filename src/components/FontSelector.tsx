import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Type } from "lucide-react";

export const fonts = [
  { id: "sans", name: "Sans Serif", className: "font-sans" },
  { id: "serif", name: "Serif", className: "font-serif" },
  { id: "mono", name: "Monospace", className: "font-mono" },
  { id: "inter", name: "Inter", className: "font-inter" },
  { id: "georgia", name: "Georgia", className: "font-georgia" },
] as const;

interface FontSelectorProps {
  currentFont: string;
  onFontChange: (font: string) => void;
}

export default function FontSelector({
  currentFont,
  onFontChange,
}: FontSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Type className="h-4 w-4" />
          Font
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font.id}
            onClick={() => onFontChange(font.id)}
            className={cn(
              "flex items-center gap-2",
              currentFont === font.id ? "bg-accent" : "",
              font.className
            )}
          >
            {font.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 