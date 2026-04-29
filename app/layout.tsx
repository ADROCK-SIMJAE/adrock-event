import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘의 혜택존",
  description: "매일 새로운 이벤트! 주유·세차·드라이브·혜택 박스 응모하고 쿠폰 당첨받기",
  openGraph: {
    title: "오늘의 혜택존",
    description: "매일 새로운 이벤트! 주유·세차·드라이브·혜택 박스 응모하고 쿠폰 당첨받기",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "오늘의 혜택존",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘의 혜택존",
    description: "매일 새로운 이벤트! 주유·세차·드라이브·혜택 박스 응모하고 쿠폰 당첨받기",
    images: ["/og-image.png"],
  },
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
