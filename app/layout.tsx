import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const metadataCopy = {
  title:
    "Mạng lưới điểm giao dịch | Agribank Chi nhánh Bắc Thành phố Hồ Chí Minh",
  description:
    "Bản đồ tương tác 5 điểm giao dịch Agribank Chi nhánh Bắc Thành phố Hồ Chí Minh.",
  applicationName: "Bản đồ mạng lưới Agribank",
};

const metadataBase = new URL(process.env.SITE_URL ?? "http://localhost:3000");
const socialTitle =
  "Mạng lưới điểm giao dịch Agribank Chi nhánh Bắc Thành phố Hồ Chí Minh";
const socialDescription =
  "Khám phá vị trí và các trục kết nối chính của 5 điểm giao dịch tại TP. Hồ Chí Minh.";

export const metadata: Metadata = {
  ...metadataCopy,
  metadataBase,
  alternates: { canonical: "/" },
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    locale: "vi_VN",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og.png",
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
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#8b1e3f",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={beVietnamPro.variable}>{children}</body>
    </html>
  );
}
