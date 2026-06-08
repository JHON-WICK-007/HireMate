"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import styles from "./Toast.module.css";

/* ─── Types ──────────────────────────────────────────────── */
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  exiting?: boolean;
}

interface ToastContextValue {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

/* ─── Context ────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null);

/* ─── Hook ───────────────────────────────────────────────── */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

/* ─── Title map ──────────────────────────────────────────── */
const titles: Record<ToastType, string> = {
  success: "Success",
  error: "Something went wrong",
  info: "Heads up",
  warning: "Warning",
};

/* ─── SVG Icons (24×24) ──────────────────────────────────── */
const icons: Record<ToastType, ReactNode> = {
  success: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
      <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
    </svg>
  ),
};

/* ─── Toast Card Component ───────────────────────────────── */
function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${toast.exiting ? styles.backdropExiting : ""}`}
        onClick={() => onDismiss(toast.id)}
      />

      {/* Centered container */}
      <div className={styles.container}>
        <div
          className={`${styles.toast} ${styles[toast.type]} ${
            toast.exiting ? styles.exiting : ""
          }`}
          style={{ "--toast-duration": `${toast.duration}ms` } as React.CSSProperties}
          role="alert"
        >
          {/* Top glow */}
          <div className={styles.glow} />

          {/* Close button */}
          <button
            className={styles.close}
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(toast.id);
            }}
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          </button>

          {/* Icon in rounded container */}
          <div className={styles.iconBox}>{icons[toast.type]}</div>

          {/* Title */}
          <div className={styles.title}>{titles[toast.type]}</div>

          {/* Message */}
          <p className={styles.message}>{toast.message}</p>

          {/* Progress bar */}
          <div className={styles.progress} />
        </div>
      </div>
    </>
  );
}

/* ─── Provider ───────────────────────────────────────────── */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
    // Clear auto-dismiss timer
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismissAll = useCallback(() => {
    setToasts((prev) => prev.map((t) => ({ ...t, exiting: true })));
    setTimeout(() => setToasts([]), 350);
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: Toast = { id, message, type, duration };

      // Only show one popup at a time — dismiss previous
      setToasts((prev) => {
        if (prev.length > 0) {
          prev.forEach((t) => {
            const timer = timersRef.current.get(t.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(t.id);
            }
          });
        }
        return [newToast];
      });

      // Auto-dismiss
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const contextValue: ToastContextValue = {
    success: (msg, dur) => addToast("success", msg, dur),
    error: (msg, dur) => addToast("error", msg, dur),
    info: (msg, dur) => addToast("info", msg, dur),
    warning: (msg, dur) => addToast("warning", msg, dur),
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Render active toast */}
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </ToastContext.Provider>
  );
}
