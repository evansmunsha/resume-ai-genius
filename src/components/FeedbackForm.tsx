"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Smile, Frown, Meh, ThumbsUp } from 'lucide-react'
import { feedbackSchema, FeedbackInput } from '@/lib/validations/feedback'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useState } from 'react'

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
  const [submitted, setSubmitted] = useState(false)

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

      setSubmitted(true)
      toast({
        variant: "premium",
        title: "Thank you! 🎉",
        description: "Your feedback helps us improve.",
      })
      reset()
      
      // Reset form after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    }
  }

  const rating = watch('rating')

  if (!user) {
    return <p className="text-center text-gray-500">Please <Link className='p-0 text-blue-700' href="/sign-in?redirect_url=/">sign in</Link> to leave feedback.</p>
  }

  return (
    <AnimatePresence>
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center py-8"
        >
          <h3 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
          <p className="text-gray-600">Your feedback has been submitted successfully.</p>
        </motion.div>
      ) : (
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6 max-w-xl mx-auto"
        >
          <div className="transition-all duration-200">
            <fieldset aria-label="Rating selection">
              <legend className="text-lg font-semibold mb-4">How would you rate your experience?</legend>
              <div className="flex flex-wrap justify-center gap-4">
                {ratingOptions.map(({ value, icon: Icon, color }) => (
                  <div key={value} className="text-center">
                    <button
                      type="button"
                      onClick={() => setValue('rating', value)}
                      className={`p-4 rounded-full transition-all hover:scale-105 ${
                        rating === value
                          ? `bg-primary/10 border-2 border-primary ${color} scale-110`
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
          <div className="relative">
            <Textarea
              maxLength={500}
              {...register('comment')}
              placeholder="Share your thoughts..."
              className="mt-2 h-32"
            />
            <span className="absolute bottom-2 right-2 text-xs text-gray-400">
              {watch('comment')?.length || 0}/500
            </span>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {['😍', '😊', '😐', '😔'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setValue('comment', 
                  `${watch('comment') || ''} ${emoji}`
                )}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="relative w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Submit</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              </>
            ) : (
              'Submit Feedback'
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

