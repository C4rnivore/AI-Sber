import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const font = Noto_Sans_Display({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SBER Transaltor",
  description: "Переводчик с нанайского",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${font.variable} antialiased `}>
        <Header />
        <main className="lg:mx-[10.417vw] mx-[7vw]">{children}</main>
        <div
          style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100vw",
            height: "5vw",
            pointerEvents: "none",
            zIndex: 50,
            background: "linear-gradient(to top, white, transparent)",
          }}
        />
      </body>
    </html>
  );
}
