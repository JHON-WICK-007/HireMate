"use client";

import React, { useRef } from "react";
import styles from "../builder.module.css";
import { Check, Link as LinkIcon, Mail, Phone, Globe, Trash2, Camera, ChevronDown } from "lucide-react";
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
  icon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  showSuccess = false,
  icon,
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
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
        <input
          className={`${styles.input} ${icon ? styles.inputWithIcon : ""} ${className}`}
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
  maxLength,
  value,
  ...props
}) => {
  const charCount = typeof value === "string" ? value.length : 0;
  const showCounter = maxLength != null;
  const isNearLimit = showCounter && charCount >= (maxLength as number) - 20;
  const isAtLimit = showCounter && charCount >= (maxLength as number);

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        {label}
        {showCounter && (
          <span
            style={{
              fontWeight: 400,
              fontSize: "0.75rem",
              color: isAtLimit ? "#ef4444" : isNearLimit ? "#f59e0b" : "var(--text-muted)",
              marginLeft: "auto",
            }}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </label>
      <textarea
        className={`${styles.textarea} ${className}`}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {showCounter && isNearLimit && (
        <span
          style={{
            color: isAtLimit ? "#ef4444" : "#f59e0b",
            fontSize: "0.8rem",
            marginTop: "0.2rem",
            display: "block",
          }}
        >
          {isAtLimit
            ? "Character limit reached."
            : `Only ${(maxLength as number) - charCount} characters left.`}
        </span>
      )}
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

interface MonthYearPickerProps {
  label: string;
  value: { month: number | null; year: number | null };
  onChange: (value: { month: number | null; year: number | null }) => void;
  disabled?: boolean;
  minDate?: { month: number | null; year: number | null };
  maxDate?: { month: number | null; year: number | null };
  menuMaxHeight?: number;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  menuMaxHeight,
}) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const maxMonth = maxDate && maxDate.month !== null ? maxDate.month : currentMonth;
  const maxYear = maxDate && maxDate.year !== null ? maxDate.year : currentYear;
  const effectiveMax = { month: maxMonth, year: maxYear };

  const allMonths = [
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

  const startYear = minDate && minDate.year !== null ? minDate.year : currentYear - 59;
  const endYear = effectiveMax.year;
  
  // Ensure we don't pass a negative value to Array.from length parameter
  const lengthVal = Math.max(0, endYear - startYear + 1);
  const years = Array.from({ length: lengthVal }, (_, i) => ({
    value: startYear + i,
    label: String(startYear + i),
  }));

  const selectedYear = value.year;

  const months = allMonths.filter((m) => {
    if (selectedYear === null || selectedYear === undefined) return true;
    if (minDate && minDate.year !== null && minDate.month !== null && selectedYear === minDate.year && m.value < minDate.month) return false;
    if (selectedYear === effectiveMax.year && m.value > effectiveMax.month) return false;
    return true;
  });

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <CustomDropdown
          label=""
          options={months}
          value={value.month ?? ""}
          onChange={(val) => onChange({ ...value, month: typeof val === "number" ? val : null })}
          placeholder="Month"
          disabled={disabled}
          menuMaxHeight={menuMaxHeight}
        />
        <CustomDropdown
          label=""
          options={years}
          value={value.year ?? ""}
          onChange={(val) => {
            const newYear = typeof val === "number" ? val : null;
            const newMonth = value.month;
            if (newYear && newMonth) {
              if (minDate && minDate.year !== null && minDate.month !== null && newYear === minDate.year && newMonth < minDate.month) {
                onChange({ year: newYear, month: minDate.month });
                return;
              }
              if (newYear === effectiveMax.year && newMonth > effectiveMax.month) {
                onChange({ year: newYear, month: effectiveMax.month });
                return;
              }
            }
            onChange({ ...value, year: newYear });
          }}
          placeholder="Year"
          disabled={disabled}
          menuMaxHeight={menuMaxHeight}
        />
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
        <div className={styles.iconWrapper}>{getIcon()}</div>
        <input
          className={`${styles.input} ${styles.inputWithIcon} ${className}`}
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
    <div className={styles.formGroup} style={{ gap: value.length > 0 ? undefined : "0.4rem" }}>
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
      {value.length > 0 && (
        <div className={styles.chipContainer} style={{ marginTop: 0, marginBottom: 0 }}>
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
      )}
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

        <span className={styles.avatarEditBtn} title="Change photo">
          <Camera size={18} />
        </span>

        {value && (
          <button
            type="button"
            className={styles.avatarDeleteBtn}
            onClick={removeImage}
            title="Remove photo"
          >
            <Trash2 size={14} />
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <label className={styles.avatarLabel}>Profile Image</label>
    </div>
  );
};

interface CustomDropdownOption {
  value: string | number;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  options: CustomDropdownOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  menuMaxHeight?: number;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  menuMaxHeight,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const isEmpty = value === "" || value === null || value === undefined;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.customDropdown} ref={containerRef}>
        <button
          type="button"
          className={`${styles.customDropdownTrigger} ${isOpen ? styles.customDropdownTriggerOpen : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={isEmpty ? styles.customDropdownPlaceholder : ""}>
            {selectedOption?.label || placeholder || String(value)}
          </span>
          <span className={`${styles.customDropdownChevron} ${isOpen ? styles.customDropdownChevronOpen : ""}`}>
            <ChevronDown size={16} />
          </span>
        </button>
        {isOpen && (
          <div className={styles.customDropdownMenu} style={menuMaxHeight ? { maxHeight: `${menuMaxHeight}px` } : undefined}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.customDropdownOption} ${option.value === value ? styles.customDropdownOptionActive : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                <span className={styles.customDropdownCheckSlot}>
                  {option.value === value && <Check size={14} strokeWidth={2.5} />}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
