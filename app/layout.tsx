import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "세차 뽑기",
  description: "정확히 맞추면 쿠폰 당첨! 세차 뽑기 이벤트",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#a9dcf3",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" as="video" href="/intro.mp4" type="video/mp4" />
        <link
          rel="prefetch"
          as="video"
          href="/running.mp4"
          type="video/mp4"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
