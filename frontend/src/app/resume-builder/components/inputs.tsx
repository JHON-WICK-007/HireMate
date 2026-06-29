"use client";

import React, { useRef } from "react";
import styles from "../builder.module.css";
import { Check, Link as LinkIcon, Mail, Phone, Globe, Trash2, Camera } from "lucide-react";
import { useResumeStore } from "../store";

const Linkedin = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showSuccess?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  showSuccess = false,
  className = "",
  required,
  ...props
}) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        {label} {required && "*"}
      </label>
      <div className="relative flex items-center">
        <input
          className={`${styles.input} ${className}`}
          required={required}
          autoComplete="off"
          {...props}
        />
        {showSuccess && props.value && !error && (
          <div className="absolute right-4 text-emerald-500 flex items-center pointer-events-none">
            <Check size={16} strokeWidth={2.5} />
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={`${styles.textarea} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

interface MonthYearPickerProps {
  label: string;
  value: { month: number | null; year: number | null };
  onChange: (value: { month: number | null; year: number | null }) => void;
  disabled?: boolean;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? parseInt(e.target.value, 10) : null;
    onChange({ ...value, month: val });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? parseInt(e.target.value, 10) : null;
    onChange({ ...value, year: val });
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <select
          className={styles.select}
          value={value.month || ""}
          onChange={handleMonthChange}
          disabled={disabled}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={value.year || ""}
          onChange={handleYearChange}
          disabled={disabled}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

interface UrlInputProps extends TextInputProps {
  typeOfUrl: "linkedin" | "github" | "portfolio" | "generic";
}

export const UrlInput: React.FC<UrlInputProps> = ({
  typeOfUrl,
  label,
  className = "",
  ...props
}) => {
  const getIcon = () => {
    switch (typeOfUrl) {
      case "linkedin":
        return <Linkedin size={16} className="text-gray-400" />;
      case "github":
        return <Github size={16} className="text-gray-400" />;
      case "portfolio":
        return <Globe size={16} className="text-gray-400" />;
      default:
        return <LinkIcon size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none">{getIcon()}</div>
        <input
          className={`${styles.input} pl-10 ${className}`}
          autoComplete="off"
          {...props}
        />
      </div>
    </div>
  );
};

interface ChipInputProps {
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export const ChipInput: React.FC<ChipInputProps> = ({
  label,
  placeholder = "Add items...",
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
        setInputValue("");
      }
    }
  };

  const removeChip = (indexToRemove: number) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <div className={styles.chipContainer}>
        {value.map((item, idx) => (
          <span key={idx} className={styles.formChip}>
            {item}
            <button
              type="button"
              className={styles.btnRemoveChip}
              onClick={() => removeChip(idx)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

interface ProfilePictureUploadProps {
  value: string;
  onChange: (base64: string) => void;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  value,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstName = useResumeStore((state) => state.personalInfo.firstName);
  const surname = useResumeStore((state) => state.personalInfo.surname);
  const initials = `${firstName ? firstName[0] : ""}${surname ? surname[0] : ""}`.toUpperCase() || "U";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={styles.avatarWrap}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="Profile" className={styles.avatarImg} />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}
        
        {value ? (
          <button
            type="button"
            className={styles.avatarEditBtn}
            onClick={removeImage}
            title="Remove photo"
          >
            <Trash2 size={18} />
          </button>
        ) : (
          <div className={styles.avatarEditBtn} title="Upload photo">
            <Camera size={18} />
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <label className={styles.label}>Profile Image</label>
    </div>
  );
};
