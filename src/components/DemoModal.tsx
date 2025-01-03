"use client"

import { useState, Suspense } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DemoModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
          Watch Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Resume Demo</DialogTitle>
          <DialogDescription>
            Watch how easy it is to create your resume with our AI-powered tool.
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video w-full h-[calc(100vh-200px)]">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
          title="Resume Demo Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        </div>
      </DialogContent>
    </Dialog>
  )
}

