import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NGB Interior Concepts & Craft",
  description: "Interior design and custom furniture studio in Kampala.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
