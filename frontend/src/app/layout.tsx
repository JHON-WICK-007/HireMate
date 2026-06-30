import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "./components/Toast";
import { ScrollToTop } from "./components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireMate AI - Intelligent Interview Preparation & Career Development",
  description:
    "Ace your next interview with AI-powered mock interviews, resume analysis, coding practice, and personalized career roadmaps. Built for developers who aim high.",
  keywords: [
    "interview preparation",
    "mock interview",
    "AI interview",
    "career development",
    "resume analysis",
    "coding interview",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning />
      <Script
        id="theme-and-auth-loader"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              history.scrollRestoration = "manual";
              document.documentElement.setAttribute('data-theme', 'dark');
              if (localStorage.getItem('token')) {
                document.documentElement.classList.add('auth-logged-in');
                document.documentElement.classList.remove('auth-logged-out');
                document.documentElement.style.setProperty('--auth-logged-in-display', 'flex');
                document.documentElement.style.setProperty('--auth-logged-out-display', 'none');
              } else {
                document.documentElement.classList.add('auth-logged-out');
                document.documentElement.classList.remove('auth-logged-in');
                document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
                document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
              }
            } catch (e) {}
          `,
        }}
      />
      <body>
        <ScrollToTop />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

