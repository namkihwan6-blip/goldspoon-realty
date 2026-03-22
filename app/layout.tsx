import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "금수저공인중개사 사무소 - 군산·새만금 토지 & 공장 전문 공인중개사",
  description: "군산시 새만금 지역 토지, 공장 매매 및 임대 전문. 새만금 산업용지, 관광레저용지, 농생명용지, 군산 국가산단 매물 정보를 제공합니다.",
  keywords: ["새만금", "군산부동산", "토지매매", "공장매매", "공인중개사", "새만금토지", "군산공장"],
  openGraph: {
    title: "금수저공인중개사 사무소",
    description: "군산·새만금 토지 & 공장 전문 공인중개사. 새만금 산업용지, 관광레저용지, 공장 매물 정보를 제공합니다.",
    url: "https://goldspoon-realty.vercel.app",
    siteName: "금수저공인중개사 사무소",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "금수저공인중개사 사무소 - 군산·새만금 토지 & 공장 전문",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "금수저공인중개사 사무소",
    description: "군산·새만금 토지 & 공장 전문 공인중개사",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
