import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vocabulary Journal｜多益單字回憶錄",
  description: "依程度出題、錯題重現，把每個多益單字收進你的回憶錄。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8138757816007679" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8138757816007679"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
