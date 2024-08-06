import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "🎨 Gerador de Identicons",
  description:
    "Crie imagens de perfil únicas e personalizadas a partir de texto.",
  openGraph: {
    title: "🎨 Gerador de Identicons",
    description:
      "Crie imagens de perfil únicas e personalizadas a partir de texto.",
    images: [
      {
        url: "https://identicon.junowoz.com/og.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@junow0z",
    images: "https://identicon.junowoz.com/og.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
