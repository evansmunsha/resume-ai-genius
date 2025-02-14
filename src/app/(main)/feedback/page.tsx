'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Frown, Meh, ThumbsUp, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Loading from '@/app/loading'
import { Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loader = useRef(null)
  const { user } = useUser()

  // Check if current user is admin
  const isAdmin = user?.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID;

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

  const loadMore = useCallback(async () => {
    if (!hasMore) return
    
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/feedback?page=${nextPage}&limit=10`)
      const data = await response.json()
      
      setFeedbacks(prev => [...prev, ...data.feedbacks])
      setHasMore(data.feedbacks.length > 0)
      setPage(nextPage)
    } catch (error) {
      console.log(error)
      toast({
        title: "Couldn't load more",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }, [page, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => observer.disconnect()
  }, [loadMore, hasMore])

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const response = await fetch(`/api/feedback?id=${feedbackId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete feedback');

      // Remove the feedback from state
      setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
      
      toast({
        variant:"premium",
        title: "Feedback deleted",
        description: "Your feedback has been removed successfully.",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to delete feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <div className="grid gap-6 animate-fade-in">
            {feedbacks.map((feedback) => {
              const Icon = ratingIcons[feedback.rating as keyof typeof ratingIcons]
              return (
                <Card key={feedback.id} className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <Icon className={`w-8 h-8 ${
                        feedback.rating === 'Excellent' ? 'text-blue-500' :
                        feedback.rating === 'Good' ? 'text-green-500' :
                        feedback.rating === 'Fair' ? 'text-yellow-500' :
                        'text-red-500'
                      }`} />
                      <div>
                        <CardTitle className="text-lg">{feedback.rating}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()} at {new Date(feedback.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(feedback.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="mt-4">
                    <p className="text-gray-700">{feedback.comment}</p>
                  </CardContent>
                </Card>
              )
            })}
            
            {hasMore && (
              <div ref={loader} className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
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

