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
    <html lang="id" className="scroll-smooth dark">
      <body className={`${inter.className} bg-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-900/40 via-black to-black text-neutral-100 antialiased min-h-screen flex flex-col selection:bg-red-900 selection:text-white`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>

        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
