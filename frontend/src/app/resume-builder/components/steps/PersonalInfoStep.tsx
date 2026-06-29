"use client";

import React from "react";
import { useResumeStore } from "../../store";
import { TextInput, UrlInput, ProfilePictureUpload } from "../inputs";
import { StepHeader } from "../navigation";
import styles from "../../builder.module.css";

export const PersonalInfoStep: React.FC = () => {
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const actions = useResumeStore((state) => state.actions);

  const handleChange = (field: keyof typeof personalInfo, value: string) => {
    actions.updatePersonalInfo(field, value);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Let's review the basics"
        description="Include your full name and contact details so employers can reach you."
      />
      <div className={styles.formCard}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile image on the left */}
          <div className="flex justify-start items-start">
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
            />
            <TextInput
              label="Surname"
              value={personalInfo.surname}
              onChange={(e) => handleChange("surname", e.target.value)}
              placeholder="e.g. GALLEGO"
              required
              showSuccess
            />
            <TextInput
              label="City"
              value={personalInfo.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="e.g. Any City"
              required
              showSuccess
            />
            <TextInput
              label="Country"
              value={personalInfo.country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="e.g. India"
              required
              showSuccess
            />
            <TextInput
              label="Pin Code"
              value={personalInfo.pinCode}
              onChange={(e) => handleChange("pinCode", e.target.value)}
              placeholder="e.g. 110034"
              required
              showSuccess
            />
            <TextInput
              label="Phone"
              value={personalInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="e.g. +91 11 1234 5677"
              required
              showSuccess
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextInput
            label="Email Address"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="e.g. hello@reallygreatsite.com"
            required
            showSuccess
          />
          <UrlInput
            label="LinkedIn URL"
            typeOfUrl="linkedin"
            value={personalInfo.linkedinUrl}
            onChange={(e) => handleChange("linkedinUrl", e.target.value)}
            placeholder="linkedin.com/in/username"
          />
          <UrlInput
            label="GitHub URL"
            typeOfUrl="github"
            value={personalInfo.githubUrl}
            onChange={(e) => handleChange("githubUrl", e.target.value)}
            placeholder="github.com/username"
          />
          <UrlInput
            label="Portfolio URL"
            typeOfUrl="portfolio"
            value={personalInfo.portfolioUrl}
            onChange={(e) => handleChange("portfolioUrl", e.target.value)}
            placeholder="portfolio.com"
          />
        </div>
      </div>
    </div>
  );
};
export default PersonalInfoStep;
