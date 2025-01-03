import { calculateDiscountedPrice } from "@/lib/subscription";

interface DiscountBannerProps {
  isEligible: boolean;
  originalPrice: number;
  discountPercentage?: number;
}

export function DiscountBanner({ isEligible, originalPrice, discountPercentage = 20 }: DiscountBannerProps) {
  if (!isEligible) return null;

  const discountedPrice = parseFloat(calculateDiscountedPrice(originalPrice, discountPercentage));
  const savings = originalPrice - discountedPrice;

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
      <p className="text-green-800 font-semibold text-center">
        Special Post-Trial Offer! 
        <span className="block text-sm mt-1">
          Subscribe now for ${discountedPrice.toFixed(2)}/month (${savings.toFixed(2)} off)
        </span>
      </p>
    </div>
  );
} 