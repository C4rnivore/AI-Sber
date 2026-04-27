import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Header from "@/components/Header";
import Aurora from "@/components/bits/Aurora/Aurora";
import InstallPrompt from "@/components/ui/InstallPrompt";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MY.HERITAGE",
  description: "AI переводчик",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("font-sans", geist.variable)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon512_maskable.png" />
        <link rel="apple-touch-icon" href="/icon512_maskable.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body
        className={`${geist.variable} antialiased lg:h-full h-max overflow-x-hidden`}
      >
        <div className="absolute max-md:fixed w-full lg:h-[30dvh] h-[50dvh] lg:inset-0 bottom-0 max-md:rotate-180">
          <Aurora
            colorStops={["#60efff", "#626DE3", "#5EB9FB"]}
            blend={1}
            amplitude={0.5}
            speed={1}
          />
        </div>
        <Header />
        <InstallPrompt />

        <main className="lg:mx-[10.417vw] mx-[4.444vw] lg:h-screen h-full ">
          {children}
        </main>
      </body>
    </html>
  );
}
