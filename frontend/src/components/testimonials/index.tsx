"use client";

import * as React from "react";
import TestimonialCard, { Testimonial } from "./TestimonialCard";
import styles from "./testimonials.module.css";

const testimonialsData: Testimonial[] = [
  // --- Column 1 Items ---
  {
    name: "Manish Kumar",
    designation: "Frontend Engineer at Razorpay",
    title: "A game-changer for Resume Building 🔥",
    content: "Before using HireMate AI, my resume was getting rejected by automated ATS screeners. The Resume Optimizer pointed out missing keywords and formatted everything cleanly. After making the suggested edits, my response rate jumped from 5% to over 40%!",
    thumbnail: "/resume-optimizer-ad.png",
    profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Alex Rivera",
    designation: "CS Graduate, UT Austin",
    title: "The personalized roadmaps kept me focused",
    content: "As a fresher, the job search was overwhelming. HireMate's AI-generated roadmaps gave me a step-by-step prep guide tailored to backend roles. I knew exactly what to study every day, and the mock coding interviews kept me sharp.",
    profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  },

  // --- Column 2 Items ---
  {
    name: "David Park",
    designation: "Full Stack Dev at Vercel",
    title: "The system design prep is top-notch",
    content: "HireMate's mock interview feedback didn't just tell me what was wrong, it explained *why* and offered standard alternatives. The layout builder is also a breeze to use for formatting. Handed me the confidence I needed to land my role at Vercel.",
    profile: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Marcus Thorne",
    designation: "Staff Engineer at Netflix",
    title: "A realistic AI coding simulation 🤯",
    content: "The AI live interview coding workspace felt exactly like a real technical round. The real-time coding editor, progress tracker, and timer kept me focused, while the AI's instant grading and edge-case feedback pinpointed my exact gaps.",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-videocall-on-his-laptop-computer-42289-large.mp4",
    thumbnail: "/live-interview-ad.png",
    profile: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"
  },

  // --- Column 3 Items ---
  {
    name: "Elena Rostova",
    designation: "Backend Engineer at Stripe",
    title: "Saves weeks of unfocused studying",
    content: "Stripe's interviews are notoriously practical. The personalized learning roadmap from HireMate mapped out all my weak points in concurrency and systems API design, focusing my preparation where it mattered. I recommend it to all my peers.",
    profile: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Aria Chen",
    designation: "Product Designer at Airbnb",
    title: "A beautiful, developer-centric builder 💯",
    content: "As a designer who codes, I care deeply about layouts and typography. HireMate's resume templates are beautifully designed and ATS-ready. It took me less than 15 minutes to format my entire resume and export a pixel-perfect PDF.",
    thumbnail: "/resume-builder-ad.png",
    profile: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200"
  }
];

export function Testimonials() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className={styles.masonryGrid}>
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
