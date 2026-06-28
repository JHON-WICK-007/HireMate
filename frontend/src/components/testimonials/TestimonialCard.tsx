"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Star, Quote } from "lucide-react";
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
  rating?: number;
  company?: string;
}

export function TestimonialCard({
  testimonial,
  index = 0,
}: {
  testimonial?: Testimonial;
  index?: number;
}) {
  const [hydrated, setHydrated] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (open) {
      setTimeout(() => {
        video.play().catch(() => {});
      }, 100);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [open]);

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
    rating = 5,
  } = testimonial;

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Quote Icon */}
        <div className={styles.quoteIcon}>
          <Quote className="w-5 h-5" />
        </div>

        {/* Stars */}
        <div className={styles.cardStars}>
          {Array.from({ length: Math.floor(rating) }).map((_, i) => (
            <Star key={i} className={styles.starIconSmall} fill="currentColor" />
          ))}
          {rating % 1 >= 0.5 && (
            <div className={styles.halfStarWrapper}>
              <div className={styles.halfStarFill}>
                <Star className={styles.starIconSmall} fill="currentColor" />
              </div>
            </div>
          )}
          <span className={styles.ratingText}>{rating}</span>
        </div>

        {/* Title */}
        {title && <h4 className={styles.cardTitle}>{title}</h4>}

        {/* Content */}
        {content && (
          <p className={styles.textContent}>&ldquo;{content}&rdquo;</p>
        )}

        {/* Media */}
        {mediaUrl ? (
          <div className={styles.mediaWrapper} onClick={() => setOpen(true)}>
            {thumbnail && (
              <Image
                src={thumbnail}
                alt={`${name}'s video`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.mediaImage}
                draggable={false}
              />
            )}
            <div className={styles.playOverlay}>
              <div className={styles.playButton}>
                <Play className="h-4 w-4 text-white fill-white ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          thumbnail && (
            <div className={styles.mediaWrapper}>
              <Image
                src={thumbnail}
                alt={`${name}'s story`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.mediaImage}
                draggable={false}
              />
            </div>
          )
        )}

        {/* Profile Footer */}
        <div className={styles.cardFooter}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarWrapper}>
              {profile ? (
                <Image
                  src={profile}
                  alt={name}
                  fill
                  sizes="36px"
                  className="object-cover"
                  draggable={false}
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

          <div className={styles.verifiedBadge}>
            <svg className="h-3 w-3 text-[var(--success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <div className={styles.modalOverlay}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.backdrop}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={styles.modalContent}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={styles.closeButton}
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
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
