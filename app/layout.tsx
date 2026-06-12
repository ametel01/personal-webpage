import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Metelli",
  description: "Personal website for Alex Metelli, software engineer."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
