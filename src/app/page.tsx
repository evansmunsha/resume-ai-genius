/* eslint-disable no-unused-vars */
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, FileCheck, Bot, PenTool } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {

  const [visibleAnswers, setVisibleAnswers] = useState<boolean[]>(Array().fill(false));

  const toggleAnswer = (index: number) => {
    setVisibleAnswers((prev) => {
      const newVisibleAnswers = [...prev];
      newVisibleAnswers[index] = !newVisibleAnswers[index];
      return newVisibleAnswers;
    });
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with social proof and clearer CTA */}
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
                <Link href={"/resumes"}>
                  Try For Free
                </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Watch Demo
                </Button>
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
              <img
                src="/resume-preview.png"
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

      {/* Features Section - Enhanced with more details */}
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
                Advanced AI technology analyzes your experience and skills to create tailored, professional documents that highlight your strengths.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileCheck className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle>ATS-Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                Our documents are optimized to pass through Applicant Tracking Systems, increasing your chances of landing interviews.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <PenTool className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle>Complete Package</CardTitle>
              </CardHeader>
              <CardContent>
                Get a matching resume and cover letter pair that maintains consistent branding and messaging throughout.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
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

      {/* Enhanced Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-600">Choose the plan that works best for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                features: ["1 Resume", "1 Cover Letter", "Basic Templates"],
                cta: "Get Started"
              },
              {
                name: "Premium",
                price: "$9.99",
                popular: true,
                features: ["3 Resumes", "3 Cover Letters", "AI Generation", "Premium Templates"],
                cta: "Start Free Trial"
              },
              {
                name: "Premium Plus",
                price: "$19.99",
                features: [
                  "Unlimited Resumes",
                  "Unlimited Cover Letters",
                  "Advanced AI Features",
                  "All Premium Features",
                  "Priority Support"
                ],
                cta: "Start Free Trial"
              }
            ].map((plan, i) => (
              <Card key={i} className={plan.popular ? "border-green-500 shadow-lg relative" : ""}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                <Button className={`w-full ${plan.popular ? "bg-green-500 hover:bg-green-600" : ""}`}>
                  <Link href={"/resumes"}>{plan.cta}</Link>
                </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
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

      {/* Call to Action */}
      <section className="py-20 bg-blue-950 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of successful job seekers who have already created their perfect resume
          </p>
          <Button size="lg" className="bg-green-500 hover:bg-green-600">
          <Link href={"/resumes"}>
            Get Started For Free
           </Link>
          </Button>
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
            {/* <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>Features</li>
                <li>Pricing</li>
                <li>Templates</li>
                <li>Examples</li>
              </ul>
            </div> */}
            {/* <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div> */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <Link href={"/tos"}>
                  <li>Terms of Service</li>
                </Link>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 Resume AI Genius. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}