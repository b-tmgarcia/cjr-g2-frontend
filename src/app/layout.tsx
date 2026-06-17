import type { Metadata } from 'next';
import { League_Spartan } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/services/contexts/AuthContext';
import './globals.css';
import type { ReactNode } from 'react';

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
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR" className={leagueSpartan.variable}>
      <body className="antialiased">
        <AuthProvider>
          <ToastContainer position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
