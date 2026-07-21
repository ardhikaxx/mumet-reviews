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
    <div className="max-w-2xl mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm shadow-black/20 border border-white/10 flex flex-col gap-3 transition-all focus-within:bg-white/10 focus-within:border-white/20"
      >
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          placeholder="Bagikan pengalaman Anda menggunakan jasa kami..."
          className="w-full bg-transparent px-2 py-2 text-sm md:text-base text-white placeholder:text-white/30 resize-none outline-none disabled:opacity-50"
          required
        />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
          <RatingStars 
            rating={rating} 
            interactive={true} 
            onRatingChange={setRating} 
          />
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto py-2 px-6 bg-white text-black hover:bg-neutral-200 text-sm rounded-full font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Kirim Ulasan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
