"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Smile, Frown, Meh, ThumbsUp } from 'lucide-react'
import { feedbackSchema, FeedbackInput } from '@/lib/validations/feedback'
import { useToast } from '@/hooks/use-toast'

const ratingOptions = [
  { value: 'Poor', icon: Frown, color: 'text-red-500' },
  { value: 'Fair', icon: Meh, color: 'text-yellow-500' },
  { value: 'Good', icon: Smile, color: 'text-green-500' },
  { value: 'Excellent', icon: ThumbsUp, color: 'text-blue-500' }
] as const;

export function FeedbackForm() {
  const { user } = useUser()
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
  })

  const onSubmit = async (data: FeedbackInput) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      })
      reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  const rating = watch('rating')

  if (!user) {
    return <p className="text-center text-gray-500">Please sign in to leave feedback.</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <fieldset>
          <legend className="text-lg font-semibold mb-4">How would you rate your experience?</legend>
          <div className="flex flex-wrap justify-center gap-4">
            {ratingOptions.map(({ value, icon: Icon, color }) => (
              <div key={value} className="text-center">
                <button
                  type="button"
                  onClick={() => setValue('rating', value)}
                  className={`p-4 rounded-full transition-all ${
                    rating === value
                      ? `bg-primary text-primary-foreground ${color} scale-110`
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <Icon className="w-8 h-8" />
                </button>
                <p className="mt-2 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </fieldset>
        {errors.rating && <p className="text-red-500 text-sm mt-2 text-center">{errors.rating.message}</p>}
      </div>
      <div>
        <Label htmlFor="comment" className="text-lg font-semibold">Any additional comments?</Label>
        <Textarea
          id="comment"
          {...register('comment')}
          placeholder="Share your thoughts..."
          className="mt-2 h-32"
        />
        {errors.comment && <p className="text-red-500 text-sm mt-2">{errors.comment.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  )
}

