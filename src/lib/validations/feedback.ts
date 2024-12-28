import { z } from "zod"

export const feedbackSchema = z.object({
  rating: z.enum(["Poor", "Fair", "Good", "Excellent"]),
  comment: z.string().min(1).max(500),
})

export type FeedbackInput = z.infer<typeof feedbackSchema>

