import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Hendrix Nagle | Full Stack Developer",
  description:
    "Portfolio of John Hendrix Nagle, a full stack developer building web apps with Next.js, React, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
