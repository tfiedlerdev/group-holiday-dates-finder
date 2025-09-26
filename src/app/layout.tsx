import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomThemeProvider } from "./theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rather Not",
    default: "Rather Not",
  },
  description:
    "Find the best dates for your group event by collecting everyone's availabilities and unavailabilities",
  keywords: ["holiday", "dates", "group", "availability", "poll", "planning"],
  authors: [{ name: "Tobias Fiedler" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </body>
    </html>
  );
}
