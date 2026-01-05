import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: "Yarışma Başvuru Formu",
  description: "Yarışmaya katılmak için başvuru formunu doldurunuz",
  openGraph: {
    title: "Yarışma Başvuru Formu",
    description: "Yarışmaya katılmak için başvuru formunu doldurunuz",
    url: 'https://yarisma-basvuru.com',
    siteName: 'Yarışma Başvuru Sistemi',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Yarışma Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Yarışma Başvuru Formu",
    description: "Yarışmaya katılmak için başvuru formunu doldurunuz",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
