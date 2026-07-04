"use client";

import React from "react";
import { motion } from "framer-motion";
import { useResumeStore, CertificationEntry } from "../../store";
import { TextInput, MonthYearPicker, UrlInput } from "../inputs";
import { StepHeader, cardVariant } from "../navigation";
import { Trash2, Plus, Eraser } from "lucide-react";
import styles from "../../builder.module.css";

export const CertificationsStep: React.FC = () => {
  const certifications = useResumeStore((state) => state.certifications);
  const actions = useResumeStore((state) => state.actions);

  const handleUpdate = (id: string, field: keyof CertificationEntry, value: any) => {
    actions.updateCertification(id, field, value);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Add your certifications"
        description="List any certificates, licenses, or credentials you hold."
      />
      <motion.div variants={cardVariant} className={styles.formCard}>
        {certifications.map((cert, index) => (
          <div key={cert.id} className={styles.entryCard}>
            <div className={styles.entryCardHeader}>
              <span className={styles.entryCardTitle}>
                Certification #{index + 1}: {cert.name || "New Certification"}
              </span>
              {index === 0 ? (
                <button
                  type="button"
                  className={styles.btnClear}
                  onClick={() => {
                    handleUpdate(cert.id, "name", "");
                    handleUpdate(cert.id, "organization", "");
                    handleUpdate(cert.id, "issueDate", { month: null, year: null });
                    handleUpdate(cert.id, "expiryDate", { month: null, year: null });
                    handleUpdate(cert.id, "noExpiry", false);
                    handleUpdate(cert.id, "credentialId", "");
                    handleUpdate(cert.id, "credentialUrl", "");
                  }}
                >
                  <Eraser size={14} />
                  Clear Form
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.btnDelete}
                  onClick={() => actions.removeCertification(cert.id)}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Certification Name"
                value={cert.name}
                onChange={(e) => handleUpdate(cert.id, "name", e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                required
              />
              <TextInput
                label="Issuing Organization"
                value={cert.organization}
                onChange={(e) => handleUpdate(cert.id, "organization", e.target.value)}
                placeholder="e.g. Amazon Web Services"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MonthYearPicker
                label="Issue Date"
                value={cert.issueDate}
                menuMaxHeight={168}
                onChange={(val) => handleUpdate(cert.id, "issueDate", val)}
              />
              <MonthYearPicker
                label="Expiration Date"
                value={cert.expiryDate}
                menuMaxHeight={168}
                onChange={(val) => handleUpdate(cert.id, "expiryDate", val)}
                disabled={cert.noExpiry}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`cert-expiry-${cert.id}`}
                checked={cert.noExpiry}
                onChange={(e) => {
                  handleUpdate(cert.id, "noExpiry", e.target.checked);
                  if (e.target.checked) {
                    handleUpdate(cert.id, "expiryDate", { month: null, year: null });
                  }
                }}
                className="w-4 h-4 rounded border-gray-700 bg-black text-cyan-500 focus:ring-0"
              />
              <label htmlFor={`cert-expiry-${cert.id}`} className="text-xs text-gray-400">
                This credential does not expire
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Credential ID"
                value={cert.credentialId}
                onChange={(e) => handleUpdate(cert.id, "credentialId", e.target.value)}
                placeholder="e.g. AWS-ASA-12345"
              />
              <UrlInput
                label="Credential URL"
                typeOfUrl="generic"
                value={cert.credentialUrl}
                onChange={(e) => handleUpdate(cert.id, "credentialUrl", e.target.value)}
                placeholder="https://verify.org/cert/123"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className={styles.btnAdd}
          onClick={actions.addCertification}
        >
          <Plus size={16} />
          Add Certification
        </button>
      </motion.div>
    </div>
  );
};
export default CertificationsStep;
