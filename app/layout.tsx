import type { Metadata } from "next";
import { QueryProvider } from "@/app/components/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "APS Face Recognition",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
