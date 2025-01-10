"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Play } from 'lucide-react'

export function DemoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size={isMobile ? "default" : "lg"}
          variant="outline" 
          className="relative group bg-white/90 text-blue-600 border-blue-200 hover:bg-white hover:border-blue-300 transition-all duration-200 w-full sm:w-auto !text-blue-600"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-center gap-2 w-full">
            <Play className="h-4 w-4" />
            <span className="!text-blue-600">Watch Demo</span>
          </div>
          {!isMobile && isHovered && (
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-sm border">
              See how it works in 2 minutes
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[800px] h-auto p-0 overflow-hidden">
        <div className="bg-white p-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              See Resume AI Genius in Action.
            </DialogTitle>
            <DialogDescription className="text-sm">
              Watch how to create professional resumes and cover letters in minutes
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="relative w-full bg-black">
          <div style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
            <iframe
              src="https://www.youtube.com/embed/Ad9adNiY4GI?autoplay=1&mute=1"
              title="Resume Demo Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

