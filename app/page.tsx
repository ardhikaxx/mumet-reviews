"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { ref, onValue, query, orderByChild } from "firebase/database";
import { auth, database, googleProvider } from "@/lib/firebase";
import toast from "react-hot-toast";
import TestimonialCard, { Testimonial } from "@/components/TestimonialCard";
import TestimonialForm from "@/components/TestimonialForm";
import Link from "next/link";
import { Star, Users, MessageSquareQuote, Loader2, CheckCircle } from "lucide-react";
import RatingStars from "@/components/RatingStars";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const testimonialsRef = query(ref(database, 'testimonials'), orderByChild('createdAt'));
    
    const unsubscribe = onValue(testimonialsRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const parsedTestimonials: Testimonial[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          // Sort descending manually since orderByChild ascending is default in Firebase RTDB
          setTestimonials(parsedTestimonials.sort((a, b) => b.createdAt - a.createdAt));
        } else {
          setTestimonials([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Gagal memuat ulasan. Silakan muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Firebase subscription error:", error);
      setError("Gagal terhubung ke database. Silakan periksa koneksi Anda.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length
    : 0;

  const userHasSubmitted = user && testimonials.some(t => t.userId === user.uid);

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Berhasil masuk!");
    } catch (error: any) {
      console.error("Login error:", error);
      // Ignore errors when user simply closes the popup or clicks multiple times
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        toast.error("Gagal masuk dengan Google");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-8 pb-4 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-sm font-medium mb-4 border border-red-900/50">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Cerita Mereka Setelah Menggunakan Jasa Kami</span>
          </div>
          
          {/* Stats */}
          {!loading && testimonials.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 pt-8">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-3xl font-bold text-white">
                  <span>{averageRating.toFixed(1)}</span>
                  <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                </div>
                <span className="text-sm text-neutral-500">Rata-rata Rating</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-neutral-200 dark:bg-neutral-800"></div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-3xl font-bold text-white">
                  <span>{testimonials.length}</span>
                  <Users className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-sm text-neutral-500">Total Client</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials List */}
      <section className="max-w-5xl mx-auto px-4 pt-4 pb-16">
        {/* CTA or Form */}
        <div className="mb-12">
          {authLoading ? (
            <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-neutral-300" /></div>
          ) : user ? (
            userHasSubmitted ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-center max-w-2xl mx-auto flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Terima kasih! Anda sudah memberikan ulasan.</span>
              </div>
            ) : (
              <TestimonialForm user={user} />
            )
          ) : (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto text-center border border-white/10 shadow-lg">
              <MessageSquareQuote className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Pernah Menggunakan Jasa Kami?</h3>
              <p className="text-neutral-400 mb-6">Bagikan pengalaman Anda untuk membantu client lainnya.</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-red-600/20 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  {isLoggingIn ? "Memproses..." : "Masuk dengan Google"}
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            <p className="text-neutral-500">Memuat testimoni...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center max-w-2xl mx-auto border border-red-100 dark:border-red-900/30">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl max-w-2xl mx-auto shadow-sm shadow-black/20 relative overflow-hidden" style={{ boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15)' }}>
            <MessageSquareQuote className="w-16 h-16 mx-auto text-white/40 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">Belum ada testimoni</h3>
            <p className="text-neutral-400 mb-6">Jadilah client pertama yang membagikan pengalaman Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}


      </section>
    </div>
  );
}
