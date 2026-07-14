import { Geist, Geist_Mono, Inter } from "next/font/google";

export const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
export const geistMono = Geist_Mono({
  variable: "--font-geistMono",
  subsets: ["latin"],
  display: "swap",
});
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});
export const fontClasses = `${geist.variable} ${geistMono.variable} ${inter.variable}`;
