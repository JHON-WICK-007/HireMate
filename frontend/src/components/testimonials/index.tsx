"use client";

import * as React from "react";
import { motion } from "framer-motion";
import TestimonialCard, { Testimonial } from "./TestimonialCard";
import FeaturedCard from "./FeaturedCard";
import styles from "./testimonials.module.css";

const featuredTestimonial: Testimonial = {
  name: "Marcus Thorne",
  designation: "Staff Engineer at Netflix",
  title: "A realistic AI coding simulation that changed everything",
  content: "The AI live interview coding workspace felt exactly like a real technical round. The real-time coding editor, progress tracker, and timer kept me focused, while the AI's instant grading and edge-case feedback pinpointed my exact gaps. After just 2 weeks of practice, I walked into my Netflix interview with confidence I never had before.",
  mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-videocall-on-his-laptop-computer-42289-large.mp4",
  thumbnail: "/live-interview-ad.png",
  profile: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    rating: 4.9,
    company: "Netflix",
};

const testimonialsData: Testimonial[] = [
  {
    name: "Manish Kumar",
    designation: "Frontend Engineer at Razorpay",
    title: "A game-changer for Resume Building",
    content: "Before using HireMate AI, my resume was getting rejected by automated ATS screeners. The Resume Optimizer pointed out missing keywords and formatted everything cleanly. After making the suggested edits, my response rate jumped from 5% to over 40%!",
    thumbnail: "/resume-optimizer-ad.png",
    profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 4.5,
    company: "Razorpay",
  },
  {
    name: "Elena Rostova",
    designation: "Backend Engineer at Stripe",
    title: "Saves weeks of unfocused studying",
    content: "Stripe's interviews are notoriously practical. The personalized learning roadmap from HireMate mapped out all my weak points in concurrency and systems API design, focusing my preparation where it mattered. I recommend it to all my peers.",
    profile: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    rating: 4.7,
    company: "Stripe",
  },
  {
    name: "Alex Rivera",
    designation: "CS Graduate, UT Austin",
    title: "The personalized roadmaps kept me focused",
    content: "As a fresher, the job search was overwhelming. HireMate's AI-generated roadmaps gave me a step-by-step prep guide tailored to backend roles. I knew exactly what to study every day, and the mock coding interviews kept me sharp.",
    profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 4.8,
    company: "UT Austin",
  },
  {
    name: "David Park",
    designation: "Full Stack Dev at Vercel",
    title: "The system design prep is top-notch",
    content: "HireMate's mock interview feedback didn't just tell me what was wrong, it explained why and offered standard alternatives. The layout builder is also a breeze to use for formatting. Handed me the confidence I needed to land my role at Vercel.",
    profile: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    rating: 4.6,
    company: "Vercel",
  },
  {
    name: "James Liu",
    designation: "ML Engineer at OpenAI",
    title: "The AI mock interviews are incredibly realistic",
    content: "The AI interview simulator adapts to your responses in real-time, just like a real FAANG interview. It probed my understanding of distributed systems with follow-up questions that exposed my knowledge gaps. Couldn't have prepared without it.",
    profile: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    rating: 4.7,
    company: "OpenAI",
  },
  {
    name: "Sarah Kim",
    designation: "DevOps Engineer at AWS",
    title: "Landed my dream role in 6 weeks",
    content: "HireMate's system design preparation was spot-on. The step-by-step breakdown of designing a URL shortener gave me a framework I used in my actual interview. The progress tracker kept me accountable throughout my prep journey.",
    thumbnail: "/resume-optimizer-ad.png",
    profile: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 4.5,
    company: "AWS",
  },
];

export function Testimonials() {
  return (
    <div className={styles.testimonialsWrapper}>
      {/* Featured Card */}
      <FeaturedCard testimonial={featuredTestimonial} />

      {/* Masonry Grid */}
      <div className={styles.masonryGrid}>
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
