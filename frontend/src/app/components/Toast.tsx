"use client";

import React, {
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

interface ToastOptions {
  description?: string;
  duration?: number;
  onRetry?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
}

interface Toast {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  duration: number;
  exiting?: boolean;
  onRetry?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
}

interface ToastContextValue {
  success: (message: string, descriptionOrDuration?: string | number, duration?: number) => void;
  error: (message: string, descriptionOrDuration?: string | number, options?: ToastOptions | number) => void;
  info: (message: string, descriptionOrDuration?: string | number, duration?: number) => void;
  warning: (message: string, descriptionOrDuration?: string | number | ToastOptions, duration?: number) => void;
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

/* ─── Inline SVGs ────────────────────────────────────────── */
const icons = {
  success: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
      <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
    </svg>
  ),
  close: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
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
    <div
      className={`${styles.toast} ${styles[toast.type]} ${
        toast.exiting ? styles.toastExiting : ""
      }`}
      role="alert"
    >
      {/* Icon */}
      {icons[toast.type]}

      {/* Content */}
      <div className={styles.content}>
        <h4 className={styles.title}>{toast.message}</h4>
        {toast.description && (
          <p className={styles.description}>{toast.description}</p>
        )}
        {toast.type === "error" && toast.onRetry && (
          <div className={styles.actions}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (toast.onRetry) toast.onRetry();
              }}
              className={styles.actionRetry}
            >
              Retry
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(toast.id);
              }}
              className={styles.actionDismiss}
            >
              Dismiss
            </button>
          </div>
        )}
        {toast.onConfirm && (
          <div className={styles.actions}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (toast.onConfirm) toast.onConfirm();
                onDismiss(toast.id);
              }}
              className={styles.actionRetry}
            >
              {toast.confirmLabel || "Yes"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(toast.id);
              }}
              className={styles.actionDismiss}
            >
              No
            </button>
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(toast.id);
        }}
        className={styles.closeBtn}
        aria-label="Dismiss"
      >
        {icons.close}
      </button>
    </div>
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
    }, 300);

    // Clear auto-dismiss timer
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismissAll = useCallback(() => {
    setToasts((prev) => prev.map((t) => ({ ...t, exiting: true })));
    setTimeout(() => {
      setToasts([]);
    }, 300);
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const addToast = useCallback(
    (
      type: ToastType,
      message: string,
      description?: string,
      duration = 4000,
      onRetry?: () => void,
      onConfirm?: () => void,
      confirmLabel?: string
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: Toast = { id, message, description, type, duration, onRetry, onConfirm, confirmLabel };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }
    },
    [dismiss]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const success = useCallback(
    (message: string, descriptionOrDuration?: string | number, duration?: number) => {
      let desc: string | undefined = undefined;
      let dur = 4000;

      if (typeof descriptionOrDuration === "string") {
        desc = descriptionOrDuration;
        if (typeof duration === "number") dur = duration;
      } else if (typeof descriptionOrDuration === "number") {
        dur = descriptionOrDuration;
      }

      addToast("success", message, desc, dur);
    },
    [addToast]
  );

  const error = useCallback(
    (
      message: string,
      descriptionOrDuration?: string | number,
      options?: ToastOptions | number
    ) => {
      let desc: string | undefined = undefined;
      let dur = 5000;
      let onRetry: (() => void) | undefined = undefined;

      if (typeof descriptionOrDuration === "string") {
        desc = descriptionOrDuration;
        if (options && typeof options === "object") {
          if (options.duration !== undefined) dur = options.duration;
          if (options.onRetry !== undefined) onRetry = options.onRetry;
        } else if (typeof options === "number") {
          dur = options;
        }
      } else if (typeof descriptionOrDuration === "number") {
        dur = descriptionOrDuration;
      } else if (descriptionOrDuration && typeof descriptionOrDuration === "object") {
        const opts = descriptionOrDuration as unknown as ToastOptions;
        desc = opts.description;
        if (opts.duration !== undefined) dur = opts.duration;
        if (opts.onRetry !== undefined) onRetry = opts.onRetry;
      }

      addToast("error", message, desc, dur, onRetry);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, descriptionOrDuration?: string | number, duration?: number) => {
      let desc: string | undefined = undefined;
      let dur = 4000;

      if (typeof descriptionOrDuration === "string") {
        desc = descriptionOrDuration;
        if (typeof duration === "number") dur = duration;
      } else if (typeof descriptionOrDuration === "number") {
        dur = descriptionOrDuration;
      }

      addToast("info", message, desc, dur);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, descriptionOrDuration?: string | number | ToastOptions, options?: number) => {
      let desc: string | undefined = undefined;
      let dur = 4000;
      let onConfirm: (() => void) | undefined = undefined;
      let confirmLabel: string | undefined = undefined;

      if (typeof descriptionOrDuration === "string") {
        desc = descriptionOrDuration;
        if (typeof options === "number") {
          dur = options;
        }
      } else if (typeof descriptionOrDuration === "number") {
        dur = descriptionOrDuration;
      } else if (descriptionOrDuration && typeof descriptionOrDuration === "object") {
        const opts = descriptionOrDuration as ToastOptions;
        desc = opts.description;
        if (opts.duration !== undefined) dur = opts.duration;
        if (opts.onConfirm !== undefined) onConfirm = opts.onConfirm;
        if (opts.confirmLabel !== undefined) confirmLabel = opts.confirmLabel;
      }

      addToast("warning", message, desc, dur, undefined, onConfirm, confirmLabel);
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ success, error, info, warning, dismiss, dismissAll }}
    >
      {children}
      <div className={styles.container}>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
