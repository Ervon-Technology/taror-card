import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mystic Tarot Insights - Unlock Your Future, with free tarot-insights",
  description: "Get deep free tarot readings and mystical insights for love, career, and personal growth.",
  keywords: ["tarot", "tarot reading", "mystic insights", "future predictions", "spiritual guidance", "free tarot readings"],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Mystic Tarot Insights",
    description: "Unlock the mysteries of your future with deep tarot insights.",
    url: "https://www.freetarotread.com", // Replace with your website URL
    type: "website",
    images: [
      {
        url: "/logo.svg", // Replace with your Open Graph image URL
        width: 1200,
        height: 630,
        alt: "Mystic Tarot Insights Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourtwitterhandle", // Replace with your Twitter handle
    title: "Mystic Tarot Insights",
    description: "Discover your destiny with our expert tarot readings.",
    images: ["/twitter-image.jpg"], // Replace with your Twitter image URL
  },
  alternates: {
    canonical: "https://www.freetarotread.com", // Replace with your canonical URL
  },
  // Optionally add robots meta tag
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": "standard",
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Metadata is already handled by Next.js, but we can add additional tags if needed */}
        <link rel="icon" href="/logo.svg" />
      </head>
      <body
        style={{ background: "linear-gradient(rgba(4, 4, 4, 0.96), rgba(38, 35, 35, 0.5)), url('/bg2.jpg')" }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}