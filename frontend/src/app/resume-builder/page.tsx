"use client";

import styles from "../resume-optimizer/resume.module.css";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import Navbar from "../components/Navbar";

export default function ResumeBuilderPage() {
  return (
    <div className={styles.page}>
      <HomeBackdrop />
      <Navbar activePage="resume-builder" />
      <main style={{ flex: 1 }} aria-hidden="true" />
      <SiteFooter />
    </div>
  );
}
