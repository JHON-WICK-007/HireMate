import type { Metadata } from "next";
import {
  Inter,
  Outfit,
  Playfair_Display,
  DM_Sans,
  DM_Serif_Display,
  JetBrains_Mono,
  Cormorant_Garamond,
} from "next/font/google";
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

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable} ${dmSans.variable} ${dmSerif.variable} ${jetbrains.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script
          id="theme-and-auth-loader"
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
                  
                  const user = JSON.parse(localStorage.getItem('user') || '{}');
                  if (user && user.avatar && user.avatar.trim() !== "") {
                    document.documentElement.style.setProperty('--user-avatar-url', 'url("' + user.avatar + '")');
                    document.documentElement.classList.add('has-avatar');
                  } else {
                    document.documentElement.style.setProperty('--user-avatar-url', 'none');
                    document.documentElement.classList.remove('has-avatar');
                  }
                  
                  let initials = "";
                  if (user && user.fullName) {
                    const parts = user.fullName.split(" ");
                    for (let i = 0; i < parts.length && i < 2; i++) {
                      if (parts[i]) initials += parts[i][0];
                    }
                    initials = initials.toUpperCase();
                  }
                  document.documentElement.style.setProperty('--user-initials', '"' + initials + '"');
                } else {
                  document.documentElement.classList.add('auth-logged-out');
                  document.documentElement.classList.remove('auth-logged-in');
                  document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
                  document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
                  document.documentElement.style.setProperty('--user-avatar-url', 'none');
                  document.documentElement.style.setProperty('--user-initials', '""');
                  document.documentElement.classList.remove('has-avatar');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ScrollToTop />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

