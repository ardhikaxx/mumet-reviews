"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, onValue, query, orderByChild } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import TestimonialCard, { Testimonial } from "@/components/TestimonialCard";
import TestimonialForm from "@/components/TestimonialForm";
import Link from "next/link";
import { Star, Users, MessageSquareQuote, Loader2 } from "lucide-react";
import RatingStars from "@/components/RatingStars";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              null
            ) : (
              <TestimonialForm user={user} />
            )
          ) : null}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}


      </section>
    </div>
  );
}
