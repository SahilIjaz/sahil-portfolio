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
  title: "Sahil Ijaz | DevOps & Software Engineer",
  description: "DevOps & Software Engineer automating cloud deployments and CI/CD pipelines. AWS, Docker, Linux, Next.js, Node.js, Express, RAG and Gen-AI.",
  keywords: ["DevOps Engineer", "Software Engineer", "AWS", "Docker", "CI/CD", "Next.js", "Node.js", "Full Stack Developer", "Sahil Ijaz", "Portfolio"],
  authors: [{ name: "Sahil Ijaz" }],
  openGraph: {
    title: "Sahil Ijaz | DevOps & Software Engineer",
    description: "DevOps & Software Engineer automating cloud deployments and CI/CD pipelines. AWS, Docker, Linux, Next.js, Node.js, Express, RAG and Gen-AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahil Ijaz | DevOps & Software Engineer",
    description: "DevOps & Software Engineer automating cloud deployments and CI/CD pipelines.",
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
