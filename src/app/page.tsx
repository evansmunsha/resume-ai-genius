"use client"

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PricingSection } from '@/components/PricingSection';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import one from "@/assets/one.jpg";
import two from "@/assets/two.jpg";
import three from "@/assets/three.jpg";
import four from "@/assets/four.jpg";
import five from "@/assets/five.jpg";
import six from "@/assets/six.jpg";
import seven from "@/assets/seven.jpg";
import eight from "@/assets/eight.jpg";
import React, { useEffect, useState } from 'react';


const FeedbackFormSection = dynamic(() => 
  import('@/components/FeedbackForm').then(mod => mod.FeedbackForm), {
    loading: () => <div className="animate-pulse h-32 bg-gray-100 rounded" />
})




const images = [one, two, three, four, five, six, seven, eight];

const NewLandingPage = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950 to-blue-900 text-white text-center">
        <h1 className="text-4xl font-bold">Welcome to Your Resume Builder</h1>
        <p className="mt-4 text-lg">Create stunning resumes in minutes!</p>
        <Link href="/resumes" className="w-full">
          <Button className="mt-6 bg-green-500 hover:bg-green-600">Get Started</Button>
        </Link>
      </section>


      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border p-6 rounded-lg shadow-md">
              <Check className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold">AI-Powered</h3>
              <p>Get AI-generated content tailored to your skills.</p>
            </div>
            <div className="border p-6 rounded-lg shadow-md">
              <Check className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold">ATS-Friendly</h3>
              <p>Ensure your resume gets past Applicant Tracking Systems.</p>

            </div>
            <div className="border p-6 rounded-lg shadow-md">
              <Check className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold">Custom Templates</h3>
              <p>Choose from a variety of professional templates.</p>

            </div>
          </div>
        </div>
      </section>


      {/* Image Section */}
      <section className="py-20 bg-gray-600 text-center">
        <h2 className="text-3xl font-bold mb-4">Example Resumes</h2>
        <div className="relative flex items-center justify-center">
          <Image 
            src={images[currentIndex]} 
            alt={`Resume example ${currentIndex + 1}`} 
            width={300} 
            height={200} 
            className='w-auto' 
          />
          <button onClick={prevImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2">Previous</button>
          <button onClick={nextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2">Next</button>
        </div>
        <div className="flex justify-center mt-4">
          {images.map((_, index) => (
            <button key={index} className={`w-3 h-3 mx-1 rounded-full ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setCurrentIndex(index)} />
          ))}
        </div>
      </section>

      {/* GIF Section */}
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-4">See It in Action</h2>
        <img
          src="/path/to/your/animation.gif"  // Replace with your actual GIF path
          alt="Demo of the tool in action"
          className="mx-auto"
          width={600}
        />
        <p className="mt-4 text-lg text-gray-700">
          Watch how our tool simplifies your resume creation process!
        </p>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 text-center">
        {/* Pricing Section Introduction */}
        <section className="py-20 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Affordable Pricing Plans</h2>
          <p className="text-lg">Choose a plan that suits your needs and start building your professional resume today!</p>
        </section>
        <PricingSection />
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-2xl px-2">
          <h2 className="text-2xl font-bold text-center mb-8">We Value Your Feedback</h2>
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
    </div>
  );
};

export default NewLandingPage;















































/* 
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Bot, PenTool, Star, Check } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import resumePreview from "@/assets/resume-preview.jpeg";
import { DemoModal } from "@/components/DemoModal"
import dynamic from 'next/dynamic'
import { SocialShare } from "@/components/SocialShare"


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
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
                  <Link href={"/resumes"}>Try For Free</Link>
                </Button>
                <div className="w-full sm:w-auto">
                  <DemoModal />
                </div>
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

      
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Career Success Starts Here
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              In today's competitive job market, you have just <span className="font-semibold text-blue-600">7 seconds</span> to make a lasting impression. Make every word count.
            </p>
          </div>

         
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">75%</div>
              <p className="text-gray-700">of resumes are rejected by ATS before reaching human eyes</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">2X</div>
              <p className="text-gray-700">more likely to get interviews with a tailored cover letter</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">93%</div>
              <p className="text-gray-700">of employers value well-written cover letters</p>
            </div>
          </div>

          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Why AI-Powered Documents Matter</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">ATS-Optimized Content</h4>
                    <p className="text-gray-600">Our AI ensures your documents pass Applicant Tracking Systems with optimized keywords and formatting</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Professional Phrasing</h4>
                    <p className="text-gray-600">Transform basic job descriptions into compelling achievements that catch recruiters' attention</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Tailored Applications</h4>
                    <p className="text-gray-600">Customize each document to match specific job requirements and company culture</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Stand Out From The Crowd</h3>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3">What Makes Us Different</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">•</span>
                    Smart AI that understands industry context
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">•</span>
                    Real-time optimization suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">•</span>
                    Professional templates designed by experts
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 sm:p-6 rounded-lg border border-green-100">
                <div className="flex flex-col items-center">
                  <div className="w-full sm:w-auto">
                    <DemoModal />
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    See how our AI helps create compelling documents in minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
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

      
      <section className="py-20">
        <PricingSection />
      </section>

      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Craft Documents That Get You Hired
            </h2>
            <p className="text-gray-600 text-lg">
              Learn the difference between average and outstanding job applications
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-blue-900">Resume Writing Guide</h3>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-red-50 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 mb-3">❌ Common Mistakes</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      Generic objectives like "Seeking a challenging position"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      Listing job duties without measurable achievements
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      Including personal information (age, marital status)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      Using complex fonts or graphics that confuse ATS
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-green-50 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-3">✅ AI-Powered Excellence</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      Quantified achievements: "Increased sales by 45% in 6 months"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      Industry-specific keywords optimized for ATS
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      Action verbs: "Spearheaded," "Implemented," "Orchestrated"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      Clean, professional formatting that passes ATS
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">🤖 How AI Helps</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">1.</span>
                    Analyzes job descriptions to identify key requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">2.</span>
                    Suggests powerful action verbs and industry-specific terminology
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">3.</span>
                    Transforms basic job duties into impressive achievements
                  </li>
                </ul>
              </div>
            </div>

           
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-blue-900">Cover Letter Mastery</h3>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-red-50 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 mb-3">❌ What to Avoid</h4>
                  <div className="bg-white p-4 rounded border border-red-200 mb-4">
                    <p className="text-sm text-gray-700 italic">
                      "Dear Hiring Manager, I am writing to apply for the position I saw advertised. 
                      I believe I would be a great fit for your company..."
                    </p>
                    <p className="text-red-600 text-sm mt-2">
                      ↑ Generic, impersonal, and fails to grab attention
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-green-50 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-3">✅ Winning Approach</h4>
                  <div className="bg-white p-4 rounded border border-green-200 mb-4">
                    <p className="text-sm text-gray-700 italic">
                      "Dear Mr. Smith, Your company's recent innovation in sustainable technology 
                      caught my attention. With my 5 years of experience in renewable energy and 
                      proven track record of reducing implementation costs by 30%..."
                    </p>
                    <p className="text-green-600 text-sm mt-2">
                      ↑ Personalized, specific, and demonstrates research
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">🤖 AI Writing Assistant</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">1.</span>
                    Generates compelling openings that grab attention
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">2.</span>
                    Tailors content to specific job requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">3.</span>
                    Creates natural transitions between paragraphs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">4.</span>
                    Ensures proper tone and professional language
                  </li>
                </ul>
              </div>
            </div>
          </div>

          
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">💡 Pro Tips for Success</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Research First</h4>
                <p className="text-sm text-blue-100">
                  Study the company and role thoroughly before writing. Our AI helps identify key company values and requirements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Customize Always</h4>
                <p className="text-sm text-blue-100">
                  Never use the same document twice. Let AI help you tailor each application to the specific role.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Review & Refine</h4>
                <p className="text-sm text-blue-100">
                  Use our AI tools to polish your content, but always add your personal touch to stand out.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              <Link href="/resumes">Create Your Winning Application</Link>
            </Button>
          </div>
        </div>
      </section>

      
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

      
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Your Resume & Cover Letter Matter More Than Ever
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              In today's competitive job market, you have just <span className="font-semibold text-blue-600">7 seconds</span> to make a lasting impression. Make them count.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-blue-900">The Hard Truth About Hiring</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">75%</span> of resumes never reach human eyes due to ATS rejection
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">88%</span> of resumes are rejected due to poor formatting
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">98%</span> of Fortune 500 companies use ATS systems
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-green-900">The Resume AI Genius Advantage</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">100%</span> ATS-optimized templates
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">3X</span> more likely to get interviews with our AI-powered content
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">24/7</span> AI assistance for perfect phrasing
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-blue-900">Your Career Journey Matters</h3>
                <p className="text-gray-700 mb-4">
                  Every job application is more than just paperwork – it's your personal brand story. In a world where opportunities are abundant but competition is fierce, standing out isn't optional – it's essential.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/resumes">Start Your Success Story</Link>
                </Button>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-green-900">Why AI Makes the Difference</h3>
                <p className="text-gray-700 mb-4">
                  Our AI doesn't just fill templates – it understands your unique value proposition and crafts compelling narratives that resonate with both ATS systems and human recruiters.
                </p>
                <DemoModal />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real Success Stories</h2>
            <p className="text-gray-600">Join thousands who've transformed their job search</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-4">
                "After 6 months of job hunting with no success, Resume AI Genius helped me land 3 interviews in my first week!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
                <div>
                  <p className="font-semibold">Sarah K.</p>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Don't Let Your Dream Job Slip Away
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Every day you wait is another opportunity missed. Create your professional resume and cover letter now with AI-powered precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              <Link href="/resumes">Create Your Resume Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/cover-letters">Write a Cover Letter</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Join over 10,000+ professionals who've trusted Resume AI Genius
          </p>
        </div>
      </section>

      
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
}  */