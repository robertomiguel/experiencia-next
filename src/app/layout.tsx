import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
        {children}
        <div className="fixed text-blue-300 right-2 p-2 bottom-0 bg-gray-700 bg-opacity-50 rounded-full underline ">
          <a
            href="https://www.linkedin.com/in/roberto-miguel-costi-b1450292/"
            target="_blank"
            rel="noreferrer"
          >
            by Roberto Miguel ®
          </a>
        </div>
      </body>
    </html>
  );
}
