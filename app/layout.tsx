import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-league-spartan",
});

export const metadata: Metadata = {
  title: "Stock.IO",
  description: "Stock.IO App",
};

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${leagueSpartan.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ToastContainer position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}