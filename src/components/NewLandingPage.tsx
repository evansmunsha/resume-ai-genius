import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import Image from 'next/image';
import { PricingSection } from './PricingSection';
import Link from 'next/link';

const NewLandingPage = () => {
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
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-4">Example Resumes</h2>
        <Image src="/path/to/your/image.jpg" alt="Resume example" width={600} height={400} />
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
    </div>
  );
};

export default NewLandingPage;
