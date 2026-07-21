"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "@/lib/firebase";
import toast from "react-hot-toast";
import RatingStars from "./RatingStars";
import { Loader2 } from "lucide-react";

interface TestimonialFormProps {
  user: User;
}

export default function TestimonialForm({ user }: TestimonialFormProps) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Silakan berikan rating bintang terlebih dahulu.");
      return;
    }
    
    if (message.trim().length < 10) {
      toast.error("Pesan testimoni minimal 10 karakter.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const testimonialsRef = ref(database, 'testimonials');
      await push(testimonialsRef, {
        userId: user.uid,
        name: user.displayName || 'Anonymous User',
        email: user.email,
        photoURL: user.photoURL,
        message: message.trim(),
        rating,
        createdAt: serverTimestamp(),
      });
      
      toast.success("Testimoni berhasil dikirim. Terima kasih!");
      setMessage("");
      setRating(0);
    } catch (error: any) {
      console.error("Error submitting testimonial:", error);
      toast.error("Gagal mengirim testimoni. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm shadow-black/20 max-w-lg mx-auto" style={{ boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15)' }}>
      <h2 className="text-xl font-bold mb-5 text-white text-center">
        Bagikan Pengalaman Anda
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2 text-center">
            Penilaian Anda
          </label>
          <RatingStars 
            rating={rating} 
            interactive={true} 
            onRatingChange={setRating} 
            className="justify-center py-2"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">
            Pesan Testimoni
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ceritakan pengalaman Anda..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-black/20 focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-colors resize-none disabled:opacity-50 text-white placeholder:text-white/30 outline-none"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Mengirim...
            </>
          ) : (
            "Kirim Testimoni"
          )}
        </button>
      </form>
    </div>
  );
}
