
import { SubscriptionLevel } from "./subscription";

export function canCreateResume(
  subscriptionLevel: SubscriptionLevel,
  totalCount: number
): boolean {
  switch (subscriptionLevel) {
    case "FREE":
      return true;
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
      return true;
    case "PRO":
      return totalCount < 5;
    case "ENTERPRISE":
      return totalCount < 5;
    default:
      return false;
  }
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel): boolean {
  return subscriptionLevel === "PRO" || subscriptionLevel === 'FREE';
}



export function canUseCustomizations(subscriptionLevel: SubscriptionLevel): boolean {
  return subscriptionLevel === 'FREE';
}
