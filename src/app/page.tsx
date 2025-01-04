/* eslint-disable no-unused-vars */
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Bot, PenTool, Star } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import resumePreview from "@/assets/resume-preview.jpeg";
import { DemoModal } from "@/components/DemoModal"
import dynamic from 'next/dynamic'
import { SocialShare } from "@/components/SocialShare"

// Dynamically import heavy components
const PricingSection = dynamic(() => 
  import('@/components/PricingSection').then(mod => mod.PricingSection), {
    loading: () => <div className="animate-pulse h-32 bg-gray-100 rounded" />
})

const FeedbackFormSection = dynamic(() => 
  import('@/components/FeedbackForm').then(mod => mod.FeedbackForm), {
    loading: () => <div className="animate-pulse h-32 bg-gray-100 rounded" />
})

export default function LandingPage() {
  const [visibleAnswers, setVisibleAnswers] = useState<boolean[]>(Array.from({ length: 5 }, () => false));

  const toggleAnswer = (index: number) => {
    setVisibleAnswers((prev) => {
      const newVisibleAnswers = [...prev];
      newVisibleAnswers[index] = !newVisibleAnswers[index];
      return newVisibleAnswers;
    });
  }; 

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-blue-950 to-blue-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
                AI-Powered Resume Builder
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Build Your <span className="text-green-500">Dream Resume</span> & Cover Letter in Just Minutes
              </h1>
              <p className="text-lg text-gray-300">
                Join thousands of job seekers who have landed their dream jobs using our AI-powered platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600">
                  <Link href={"/resumes"}>Try For Free</Link>
                </Button>
                <DemoModal />
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-400/20 border border-white/20" />
                  ))}
                </div>
                <p className="text-sm">
                  <span className="font-bold">1,000+</span> resumes created this week
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-transparent rounded-lg" />
              <Image
                src={resumePreview}
                width={400}
                height={300}
                priority
                quality={75}
                placeholder="blur"
                alt="Resume preview"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <p className="text-gray-600">Trusted by job seekers from leading companies</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
            {['Google', 'Microsoft', 'Apple', 'Amazon'].map((company) => (
              <div key={company} className="flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform helps you create professional resumes and cover letters that get you noticed
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Bot className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                Advanced AI technology analyzes your experience and skills to create tailored, professional documents.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileCheck className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle>ATS-Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                Our documents are optimized to pass through Applicant Tracking Systems.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <PenTool className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle>Complete Package</CardTitle>
              </CardHeader>
              <CardContent>
                Get a matching resume and cover letter pair that maintains consistent branding.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Software Engineer",
                company: "Tech Company",
                text: "Resume AI Genius helped me land my dream job! The AI-generated resume was spot-on.",
                rating: 5
              },
              {
                name: "Marketing Manager",
                company: "Fortune 500",
                text: "I was skeptical at first, but the quality of the resume blew me away. Highly recommended!",
                rating: 5
              },
              {
                name: "Recent Graduate",
                company: "University",
                text: "The ATS-friendly feature is a game-changer. I'm getting more callbacks than ever before.",
                rating: 5
              }
            ].map((testimonial, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{testimonial.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <PricingSection />
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "How does Resume AI Genius work?",
                a: "Our AI analyzes your input and creates tailored, professional resumes and cover letters. Simply enter your details, and our AI will generate optimized documents in minutes."
              },
              {
                q: "Is my information secure?",
                a: "Yes, we use bank-level encryption to protect your data. Your information is never shared with third parties."
              },
              {
                q: "Can I edit my resume after it's generated?",
                a: "You have full control to edit, customize, and fine-tune your documents after AI generation."
              },
              {
                q: "How long does it take to create a resume?",
                a: "Most users complete their resume in less than 10 minutes using our AI-powered platform."
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time with no questions asked."
              }
            ].map((faq, i) => (
              <Card key={i}>
                <CardHeader className="cursor-pointer" onClick={() => toggleAnswer(i)}>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent className={`${visibleAnswers[i] ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center mb-8">We Value Your Feedback</h2>
          <Card>
            <CardHeader>
              <CardTitle>Help Us Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <FeedbackFormSection />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-950 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of successful job seekers who have already created their perfect resume
          </p>
          <Button size="lg" className="bg-green-500 hover:bg-green-600">
            <Link href={"/resumes"}>Get Started For Free</Link>
          </Button>
        </div>
      </section>

      {/* Add Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mt-8 flex justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Share with friends</p>
                <SocialShare />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">Resume AI Genius</h3>
              <p className="text-sm">
                Creating professional resumes and cover letters with AI technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <Link href={"/tos"}>
                  <li>Terms of Service</li>
                </Link>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-4 pt-3 text-center text-sm">
            <p>&copy; 2024-2025 Resume AI Genius. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}