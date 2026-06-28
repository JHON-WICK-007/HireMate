"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import Image from "next/image";
import styles from "./testimonials.module.css";

export interface Testimonial {
  name: string;
  designation: string;
  title?: string;
  profile?: string;
  content: string;
  mediaUrl?: string;
  thumbnail?: string;
}

export function TestimonialCard({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const [hydrated, setHydrated] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [open, setOpen] = React.useState(false);

  // Set hydrated to true after mounting on client to avoid server-side mismatches
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  // Handle video play/pause based on modal state
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (open) {
      // Small delay to ensure modal is rendered and visible before play
      setTimeout(() => {
        video.play().catch((err) => {
          console.log("Video auto-play blocked or failed:", err);
        });
      }, 100);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [open]);

  // Render a skeleton/fallback if testimonial data is missing
  if (!testimonial) {
    return (
      <div className={styles.testimonialCard}>
        <div className="text-center text-[var(--text-secondary)]">
          Loading testimonial...
        </div>
      </div>
    );
  }

  const {
    name = "Anonymous",
    profile = "",
    title = "",
    designation = "Customer",
    content = "No testimonial available.",
    mediaUrl,
    thumbnail,
  } = testimonial;

  // Render a loading state during server hydration to prevent UI mismatch
  if (!hydrated) {
    return (
      <div className={`${styles.testimonialCard} animate-pulse min-h-[150px] flex items-center justify-center`}>
        <div className="text-sm text-[var(--text-secondary)]">Loading success story...</div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        layout
        className={styles.testimonialCard}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Top Section: Author Profile & Verification */}
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarWrapper}>
              {profile ? (
                <Image
                  src={profile}
                  alt={name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <span className={styles.avatarFallback}>
                  {name.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h5 className={styles.profileName}>{name}</h5>
              <p className={styles.profileDesignation}>{designation}</p>
            </div>
          </div>

          {/* Verified Badge */}
          <div className={styles.verifiedBadge} title="Verified success story from a real customer">
            <svg className="h-3.5 w-3.5 text-[var(--success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className={styles.verifiedText}>Verified</span>
          </div>
        </div>

        {/* Title / Headline */}
        {title && (
          <h4 className={styles.cardTitle}>
            {title}
          </h4>
        )}

        {/* Content Quote Text */}
        {content && (
          <p className={styles.textContent}>
            "{content}"
          </p>
        )}

        {/* Media Section (Video or Image) at the bottom */}
        {mediaUrl ? (
          <div className={styles.mediaWrapper} onClick={() => setOpen(true)}>
            {thumbnail || mediaUrl ? (
              <Image
                src={thumbnail || "/placeholder-video.jpg"}
                alt={`${name}'s video testimonial`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.mediaImage}
                priority={false}
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-[var(--text-secondary)]">
                Video testimonial
              </div>
            )}
            {/* Play Overlay */}
            <div className={styles.playOverlay}>
              <div className={styles.playButton}>
                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          thumbnail && (
            <div className={styles.mediaWrapper}>
              <Image
                src={thumbnail}
                alt={`${name}'s success story`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.mediaImage}
              />
            </div>
          )
        )}
      </motion.div>

      {/* Video Modal overlay using AnimatePresence */}
      <AnimatePresence>
        {open && (
          <div className={styles.modalOverlay}>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.backdrop}
              onClick={() => setOpen(false)}
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={styles.modalContent}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={styles.closeButton}
                aria-label="Close video testimonial"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Video Player */}
              <div className={styles.videoWrapper}>
                <video
                  ref={videoRef}
                  controls
                  playsInline
                  preload="auto"
                  poster={thumbnail}
                  className={styles.videoElement}
                >
                  {mediaUrl && <source src={mediaUrl} type="video/mp4" />}
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TestimonialCard;
