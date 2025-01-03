'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Frown, Meh, ThumbsUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Loading from '@/app/loading'

interface Feedback {
  id: string
  rating: string
  comment: string
  createdAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

const ratingIcons = {
  'Poor': Frown,
  'Fair': Meh,
  'Good': Smile,
  'Excellent': ThumbsUp
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchFeedbacks = async (page: number = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/feedback?page=${page}&limit=10`)
      if (!response.ok) {
        throw new Error('Failed to fetch feedback')
      }
      const data = await response.json()
      setFeedbacks(data.feedbacks)
      setPagination(data.pagination)
    } catch (error) {
      console.log('feedback',error)
      toast({
        title: "Error",
        description: "Failed to fetch feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <Loading/>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">User Feedback</h1>
        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-500">No feedback submitted yet.</p>
        ) : (
          <div className="grid gap-6">
            {feedbacks.map((feedback) => {
              const Icon = ratingIcons[feedback.rating as keyof typeof ratingIcons]
              return (
                <Card key={feedback.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Icon className={`w-8 h-8 ${
                      feedback.rating === 'Excellent' ? 'text-blue-500' :
                      feedback.rating === 'Good' ? 'text-green-500' :
                      feedback.rating === 'Fair' ? 'text-yellow-500' :
                      'text-red-500'
                    }`} />
                    <div>
                      <CardTitle>{feedback.rating}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{feedback.comment}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
        {pagination && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => fetchFeedbacks(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="self-center">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              onClick={() => fetchFeedbacks(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

