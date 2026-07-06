"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useResumeStore } from "../../store";
import { TextInput, UrlInput, ProfilePictureUpload } from "../inputs";
import { StepHeader, cardVariant, isValidEmail, isValidPhone, isValidPinCode, isValidUrl, isValidLocation, isValidName, isValidGithubUrl } from "../navigation";
import styles from "../../builder.module.css";

export const PersonalInfoStep: React.FC = () => {
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const actions = useResumeStore((state) => state.actions);

  const handleChange = (field: keyof typeof personalInfo, value: string) => {
    actions.updatePersonalInfo(field, value);
  };

  // Compute validation errors dynamically
  const firstNameError = personalInfo.firstName && !isValidName(personalInfo.firstName) ? "Invalid name format (letters/spaces/hyphens/apostrophes only, 2-50 chars)." : "";
  const surnameError = personalInfo.surname && !isValidName(personalInfo.surname) ? "Invalid surname format (letters/spaces/hyphens/apostrophes only, 2-50 chars)." : "";
  const cityError = personalInfo.city && !isValidLocation(personalInfo.city) ? "City name must contain only letters (e.g. London)." : "";
  const countryError = personalInfo.country && !isValidLocation(personalInfo.country) ? "Country name must contain only letters (e.g. Canada)." : "";
  const pinCodeError = personalInfo.pinCode && !isValidPinCode(personalInfo.pinCode) ? "Pin Code must be alphanumeric and contain at least one digit." : "";
  const phoneError = personalInfo.phone && !isValidPhone(personalInfo.phone) ? "Invalid phone format (min 7 digits, e.g. +91 11 1234 5677)." : "";
  const emailError = personalInfo.email && !isValidEmail(personalInfo.email) ? "Please enter a valid email address (e.g. name@domain.com)." : "";
  const linkedinError = personalInfo.linkedinUrl && !isValidUrl(personalInfo.linkedinUrl) ? "Please enter a valid URL." : "";
  const githubError = personalInfo.githubUrl && !isValidGithubUrl(personalInfo.githubUrl) ? "Please enter a valid GitHub URL (e.g. github.com/username)." : "";
  const portfolioError = personalInfo.portfolioUrl && !isValidUrl(personalInfo.portfolioUrl) ? "Please enter a valid URL." : "";

  return (
    <div className="flex flex-col gap-0">
      <StepHeader
        title="Let's review the basics"
        description="Include your full name and contact details so employers can reach you."
      />
      <motion.div variants={cardVariant} className={styles.formCard} style={{ marginTop: "1.5rem" }}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile image on the left */}
          <div className="flex justify-start items-center">
            <ProfilePictureUpload
              value={personalInfo.profilePicture}
              onChange={(base64) => handleChange("profilePicture", base64)}
            />
          </div>

          {/* Grid of inputs on the right */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              value={personalInfo.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="e.g. DANIEL"
              required
              showSuccess
              error={firstNameError}
            />
            <TextInput
              label="Surname"
              value={personalInfo.surname}
              onChange={(e) => handleChange("surname", e.target.value)}
              placeholder="e.g. GALLEGO"
              required
              showSuccess
              error={surnameError}
            />
            <TextInput
              label="City"
              value={personalInfo.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="e.g. Any City"
              required
              showSuccess
              error={cityError}
            />
            <TextInput
              label="Country"
              value={personalInfo.country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="e.g. India"
              required
              showSuccess
              error={countryError}
            />
            <TextInput
              label="Pin Code"
              value={personalInfo.pinCode}
              onChange={(e) => handleChange("pinCode", e.target.value)}
              placeholder="e.g. 110034"
              required
              showSuccess
              error={pinCodeError}
            />
            <TextInput
              label="Phone"
              value={personalInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="e.g. +91 11 1234 5677"
              required
              showSuccess
              error={phoneError}
            />
          </div>
        </div>
      </motion.div>

      {/* Contact & Online Presence Section */}
      <motion.div variants={cardVariant} className={styles.formCard}>
        <p className={styles.formSectionTitle}>Contact & Online Presence</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Email Address"
            type="email"
            icon={<Mail size={16} className="text-gray-400" />}
            value={personalInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="e.g. hello@reallygreatsite.com"
            required
            showSuccess
            error={emailError}
          />
          <UrlInput
            label="LinkedIn URL"
            typeOfUrl="linkedin"
            value={personalInfo.linkedinUrl}
            onChange={(e) => handleChange("linkedinUrl", e.target.value)}
            placeholder="linkedin.com/in/username"
            error={linkedinError}
          />
          <UrlInput
            label="GitHub URL"
            typeOfUrl="github"
            value={personalInfo.githubUrl}
            onChange={(e) => handleChange("githubUrl", e.target.value)}
            placeholder="github.com/username"
            error={githubError}
          />
          <UrlInput
            label="Portfolio URL"
            typeOfUrl="portfolio"
            value={personalInfo.portfolioUrl}
            onChange={(e) => handleChange("portfolioUrl", e.target.value)}
            placeholder="portfolio.com"
            error={portfolioError}
          />
        </div>
      </motion.div>
    </div>
  );
};
export default PersonalInfoStep;
