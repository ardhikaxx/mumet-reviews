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
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-7 border border-neutral-100 dark:border-neutral-800 flex flex-col h-full hover:shadow-sm transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          {testimonial.photoURL ? (
            <img
              src={testimonial.photoURL}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover border border-neutral-100 dark:border-neutral-800"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center font-medium text-sm">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
              {testimonial.name}
            </h3>
            <div className="mt-1">
              <RatingStars rating={testimonial.rating} />
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed flex-grow">
        "{testimonial.message}"
      </p>
      
      <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
        {formattedDate}
      </div>
    </div>
  );
}
