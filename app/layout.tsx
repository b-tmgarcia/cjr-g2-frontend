import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
 
const leagueSpartan = League_Spartan({
  weight: "600",
  subsets: ["latin"],
  variable: "--font-league-spartan",
});
 
export const metadata: Metadata = {
  title: "Stock.IO",
  description: "Stock.IO App",
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={leagueSpartan.variable}>
      <body>{children}</body>
    </html>
  );
}



