"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Star, Quote } from "lucide-react";
import Image from "next/image";
import styles from "./testimonials.module.css";
import { Testimonial } from "./TestimonialCard";

export function FeaturedCard({ testimonial }: { testimonial: Testimonial }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [open, setOpen] = React.useState(false);

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

  if (!testimonial) return null;

  const {
    name,
    profile = "",
    title,
    designation,
    content,
    mediaUrl,
    thumbnail,
    rating = 5,
  } = testimonial;

  return (
    <>
      <motion.div
        className={styles.featuredCard}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.featuredInner}>
          {/* Left: Video */}
          <div className={styles.featuredVideoSide}>
            <div className={styles.featuredVideoWrapper} onClick={() => setOpen(true)}>
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt={`${name}'s video testimonial`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.featuredVideoImage}
                  draggable={false}
                />
              )}
              <div className={styles.featuredPlayOverlay}>
                <div className={styles.featuredPlayButton}>
                  <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                </div>
                <span className={styles.featuredPlayText}>Watch Story</span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className={styles.featuredContentSide}>

            <div className={styles.featuredQuoteIcon}>
              <Quote className="w-5 h-5" />
            </div>

            <div className={styles.featuredStars}>
              {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                <Star key={i} className={styles.starIcon} fill="currentColor" />
              ))}
              {rating % 1 >= 0.5 && (
                <div className={styles.halfStarWrapperFeatured}>
                  <div className={styles.halfStarFillFeatured}>
                    <Star className={styles.starIcon} fill="currentColor" />
                  </div>
                </div>
              )}
              <span className={styles.ratingTextFeatured}>{rating}</span>
            </div>

            {title && <h3 className={styles.featuredTitle}>{title}</h3>}

            {content && (
              <p className={styles.featuredText}>&ldquo;{content}&rdquo;</p>
            )}

            <div className={styles.featuredProfile}>
              <div className={styles.featuredAvatar}>
                {profile ? (
                  <Image
                    src={profile}
                    alt={name}
                    fill
                    sizes="48px"
                    className="object-cover"
                    draggable={false}
                  />
                ) : (
                  <span className={styles.avatarFallback}>{name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h5 className={styles.featuredName}>{name}</h5>
                <p className={styles.featuredDesignation}>{designation}</p>
              </div>
            </div>
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

export default FeaturedCard;
