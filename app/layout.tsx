import type { Metadata } from "next";
import { QueryProvider } from "@/app/components/query-provider";
import { ThemeToggle } from "@/app/components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "APS Face Recognition",
};

const themeScript = `(function(){try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="h-full">
        <QueryProvider>
          {children}
          <div className="fixed right-4 bottom-4 z-40">
            <ThemeToggle />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
