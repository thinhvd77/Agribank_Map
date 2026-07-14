import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadataCopy = {
  title: "M\u1ea1ng l\u01b0\u1edbi \u0111i\u1ec3m giao d\u1ecbch | Agribank Chi nh\u00e1nh 8",
  description:
    "B\u1ea3n \u0111\u1ed3 t\u01b0\u01a1ng t\u00e1c 5 \u0111i\u1ec3m giao d\u1ecbch Agribank Chi nh\u00e1nh 8 t\u1ea1i TP. H\u1ed3 Ch\u00ed Minh.",
  applicationName: "B\u1ea3n \u0111\u1ed3 m\u1ea1ng l\u01b0\u1edbi Agribank",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = `${origin}/og.png`;
  const socialTitle =
    "M\u1ea1ng l\u01b0\u1edbi \u0111i\u1ec3m giao d\u1ecbch Agribank Chi nh\u00e1nh 8";
  const socialDescription =
    "Kh\u00e1m ph\u00e1 v\u1ecb tr\u00ed v\u00e0 c\u00e1c tr\u1ee5c k\u1ebft n\u1ed1i ch\u00ednh c\u1ee7a 5 \u0111i\u1ec3m giao d\u1ecbch t\u1ea1i TP. H\u1ed3 Ch\u00ed Minh.";

  return {
    ...metadataCopy,
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1732,
          height: 908,
          alt: socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [imageUrl],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#8b1e3f",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
