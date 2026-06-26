import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashanti Pension Advisory & Referral Platform",
  description:
    "Expert pension advisory services. Unlock your pension value with trusted guidance from Ashanti Pension.",
  keywords: [
    "pension advisory",
    "pension Kenya",
    "retirement planning",
    "pension transfer",
    "Ashanti pension",
    "pension agent",
    "pension quotation",
  ],
  authors: [{ name: "Ashanti Pension" }],
  openGraph: {
    title: "Ashanti Pension Advisory & Referral Platform",
    description:
      "Unlock your pension value with expert guidance from Ashanti Pension.",
    type: "website",
    locale: "en_KE",
    siteName: "Ashanti Pension",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#094029",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
