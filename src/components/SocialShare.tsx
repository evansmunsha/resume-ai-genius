"use client"

import { Button } from "./ui/button"
import { Twitter as X, Linkedin, Facebook } from "lucide-react"

export function SocialShare() {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const title = "Create professional resumes with AI - Resume Genius"

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(shareLinks.twitter, '_blank')}
      >
        <X className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
      >
        <Linkedin className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(shareLinks.facebook, '_blank')}
      >
        <Facebook className="w-4 h-4" />
      </Button>
    </div>
  )
} 