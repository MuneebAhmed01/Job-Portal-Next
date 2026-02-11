'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Software Engineer',
    company: 'Google',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    content: 'JobForge helped me land my dream job at Google. The AI-powered resume analyzer was a game changer - it helped me optimize my resume and increased my callback rate by 3x!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Product Manager',
    company: 'Microsoft',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    content: 'The career guidance feature gave me clarity on my career path. Within 2 months of using JobForge, I transitioned from engineering to product management successfully.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ananya Patel',
    role: 'Data Scientist',
    company: 'Amazon',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    content: 'As a fresher, I was overwhelmed by the job market. JobForge\'s personalized recommendations helped me focus on the right opportunities. Now I\'m working at Amazon!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'DevOps Engineer',
    company: 'Netflix',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    content: 'The platform is incredibly intuitive. I uploaded my resume, got instant ATS feedback, and applied to curated jobs. Got 5 interview calls in the first week!',
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 bg-linear-to-tbr from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs through JobForge
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <Quote className="absolute top-6 left-6 w-12 h-12 text-blue-100 dark:text-gray-700" />
          
          <div className="relative z-10">
            {/* Content */}
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 italic">
              &ldquo;{current.content}&rdquo;
            </p>

            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={current.image}
                  alt={current.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{current.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {current.role} at <span className="font-medium text-blue-600">{current.company}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
