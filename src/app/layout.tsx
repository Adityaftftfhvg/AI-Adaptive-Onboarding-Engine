import type { Metadata } from "next";
import "./globals.css";


import Providers from "@/components/Providers";


export const metadata: Metadata = {
  title: "PathForge — AI Onboarding Engine",
  description: "AI-powered personalized learning pathway generator",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">

      <body>
        <Providers>{children}</Providers>
      </body>

    </html>
  );
}