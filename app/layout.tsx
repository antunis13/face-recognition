import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APS Face Recognition",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
