import type { Metadata } from "next";
import type { ReactNode } from "react";
import { defaultDescription, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} - ${site.role}`,
    template: `%s | ${site.name}`
  },
  description: defaultDescription
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
