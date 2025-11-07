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
        <main className="mx-[10.417vw]">{children}</main>
      </body>
    </html>
  );
}
