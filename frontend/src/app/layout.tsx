import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/Toast";

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
      <head>
        <script
          id="theme-and-auth-loader"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.setAttribute('data-theme', 'dark');
                if (localStorage.getItem('token')) {
                  document.documentElement.classList.add('auth-logged-in');
                  document.documentElement.classList.remove('auth-logged-out');
                } else {
                  document.documentElement.classList.add('auth-logged-out');
                  document.documentElement.classList.remove('auth-logged-in');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

