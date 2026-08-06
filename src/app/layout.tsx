import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
=======
import Providers from "@/components/Providers";
>>>>>>> 1994384d9fedfbe400d6911da1b972e6c5caff88

export const metadata: Metadata = {
  title: "PathForge — AI Onboarding Engine",
  description: "AI-powered personalized learning pathway generator",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body>{children}</body>
=======
      <body>
        <Providers>{children}</Providers>
      </body>
>>>>>>> 1994384d9fedfbe400d6911da1b972e6c5caff88
    </html>
  );
}