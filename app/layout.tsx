import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Sahil Ijaz | Full Stack Developer",
  description: "Full Stack Developer specializing in Next.js, Node.js, and React. Building scalable, real-time web applications with modern technologies.",
  keywords: ["Full Stack Developer", "Next.js", "React", "Node.js", "Web Developer", "Sahil Ijaz", "Portfolio"],
  authors: [{ name: "Sahil Ijaz" }],
  openGraph: {
    title: "Sahil Ijaz | Full Stack Developer",
    description: "Full Stack Developer specializing in Next.js, Node.js, and React. Building scalable, real-time web applications.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahil Ijaz | Full Stack Developer",
    description: "Full Stack Developer specializing in Next.js, Node.js, and React.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
