"use client";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import RatingStars from "./RatingStars";

export interface Testimonial {
  id: string;
  userId: string;
  name: string;
  email: string;
  photoURL: string | null;
  message: string;
  rating: number;
  createdAt: number;
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const formattedDate = testimonial.createdAt
    ? formatDistanceToNow(new Date(testimonial.createdAt), { addSuffix: true, locale: id })
    : "Baru saja";

  return (
    <div className="bg-[#1C1C1F] dark:bg-[#1C1C1F] rounded-2xl p-6 sm:p-7 flex flex-col h-full border border-neutral-800">
      <div className="mb-4">
        <RatingStars rating={testimonial.rating} maxRating={5} className="scale-90 origin-left" />
      </div>
      
      <div className="flex-grow mb-6">
        <p className="text-[#D1D5DB] text-[15px] leading-relaxed">
          {testimonial.message}
        </p>
      </div>
      
      <div className="flex items-center gap-3 mt-auto">
        {testimonial.photoURL ? (
          <img
            src={testimonial.photoURL}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center font-medium text-sm">
            {testimonial.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-white">
            {testimonial.name}
          </h3>
          <span className="text-[13px] text-[#9CA3AF] mt-0.5">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
