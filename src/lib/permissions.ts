
import { SubscriptionLevel } from "./subscription";

export function canCreateResume(
  subscriptionLevel: SubscriptionLevel,
  totalCount: number
): boolean {
  switch (subscriptionLevel) {
    case "FREE":
      return totalCount < 1;
    case "PRO":
      return totalCount < 5;
    case "ENTERPRISE":
      return true;
    default:
      return false;
  }
}

// Trial users will have PRO-level access



export function canCreateCoverLetter(
  subscriptionLevel: SubscriptionLevel,
  totalCount: number,
): boolean {
  switch (subscriptionLevel) {
    case "FREE":
      return totalCount < 1;
    case "PRO":
      return totalCount < 5;
    case "ENTERPRISE":
      return true;
    default:
      return false;
  }
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel): boolean {
  return subscriptionLevel === "PRO" || subscriptionLevel === "ENTERPRISE";
}



export function canUseCustomizations(subscriptionLevel: SubscriptionLevel): boolean {
  return subscriptionLevel === "ENTERPRISE";
}
