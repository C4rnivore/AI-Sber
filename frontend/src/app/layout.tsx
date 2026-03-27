import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Header from "@/components/Header";
import Aurora from "@/components/bits/Aurora/Aurora";

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

      <body className={`${geist.variable} antialiased h-[100dvh]`}>
        <div className="absolute w-full h-[60dvh] inset-0">
          <Aurora
            colorStops={["#60efff", "#626DE3", "#5EB9FB"]}
            blend={1}
            amplitude={0.5}
            speed={0.5}
          />
        </div>
        <Header />

        <main className="lg:mx-[10.417vw] mx-[7vw] h-full">{children}</main>
      </body>
    </html>
  );
}
