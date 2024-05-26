import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/store/Providers";
import { MainMenu } from "@/components/common/MainMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ID Inteligencia digital",
  description: "Next JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <body className={inter.className}>
        <MainMenu />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
