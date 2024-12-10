import LoadingButton from "@/components/LoadingButton"; // Import your loading button component
import { useToast } from "@/hooks/use-toast"; // Import your toast hook
import usePremiumModal from "@/hooks/usePremiumModal"; // Import your premium modal hook
import { canUseAITools } from "@/lib/permissions"; // Import permission check
import { CoverLetterValues } from "@/lib/validation"; // Import your validation types
import { WandSparklesIcon } from "lucide-react"; // Import your icon
import { useState } from "react"; // Import useState
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider"; // Import subscription level provider
import { generateOpening } from "./actions"; // Import your action to generate opening

interface GenerateOpeningButtonProps {
  coverLetterData: CoverLetterValues; // Define the type for cover letter data
  onOpeningGenerated: (opening: string) => void; // Callback for when the opening is generated
}

export default function GenerateOpeningButton({
  coverLetterData,
  onOpeningGenerated,
}: GenerateOpeningButtonProps) {
  const subscriptionLevel = useSubscriptionLevel(); // Get the user's subscription level
  const premiumModal = usePremiumModal(); // Hook for managing the premium modal
  const { toast } = useToast(); // Hook for displaying toast notifications
  const [loading, setLoading] = useState(false); // State for loading

  async function handleClick() {
    // Check if the user can use AI tools
    if (!canUseAITools(subscriptionLevel)) {
      premiumModal.setOpen(true); // Open the premium modal if not allowed
      return;
    }

    try {
      setLoading(true); // Set loading state to true
      const aiResponse = await generateOpening({
        ...coverLetterData,
        achievements: coverLetterData.achievements || [] // Provide default empty array
      }); // Call the generateOpening function
      onOpeningGenerated(aiResponse); // Call the callback with the generated opening
    } catch (error) {
      console.error(error); // Log the error
      toast({
        variant: "destructive", // Set the toast variant
        description: "Something went wrong. Please try again.", // Toast message
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <LoadingButton
      variant="outline" // Button variant
      type="button" // Button type
      onClick={handleClick} // Click handler
      loading={loading} // Loading state
    >
      <WandSparklesIcon className="size-4" /> {/* Icon */}
      Generate Opening (AI) {/* Button text */}
    </LoadingButton>
  );
}
