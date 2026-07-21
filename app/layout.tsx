import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Testimoni Client | Layanan Digital Terbaik",
  description: "Kumpulan testimoni dan ulasan dari client yang telah menggunakan layanan pembuatan website, aplikasi, dan software kami.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400 mt-12 border-t border-neutral-200 dark:border-neutral-800">
          <p>&copy; {new Date().getFullYear()} Testimoni MUMET.IN. All rights reserved.</p>
        </footer>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
