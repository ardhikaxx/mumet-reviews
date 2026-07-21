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
    <div className="bg-[#F3F4F6] dark:bg-neutral-800 rounded-3xl pt-8 px-8 flex flex-col h-full relative overflow-hidden">
      <div className="flex-grow pb-10">
        <span className="text-7xl text-neutral-300 dark:text-neutral-600 font-serif leading-none block h-10 mb-2">
          &ldquo;
        </span>
        <p className="text-[17px] font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
          {testimonial.message}
        </p>
      </div>
      
      <div className="flex -mx-8 mt-auto">
        <div className="bg-white dark:bg-neutral-950 rounded-tr-[2.5rem] py-4 pl-8 pr-8 min-w-[75%] flex items-center gap-3">
          {testimonial.photoURL ? (
            <img
              src={testimonial.photoURL}
              alt={testimonial.name}
              className="w-11 h-11 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 flex items-center justify-center font-medium text-sm">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {testimonial.name}
            </h3>
            <span className="text-xs text-neutral-500">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
