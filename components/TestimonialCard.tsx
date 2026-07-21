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
    <div className="bg-neutral-100 dark:bg-neutral-900 rounded-[2rem] pt-8 px-8 flex flex-col h-full overflow-hidden">
      <div className="flex-grow pb-10">
        <svg 
          className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-6 fill-current" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-xl md:text-2xl font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
          {testimonial.message}
        </p>
      </div>
      
      <div className="flex -mx-8 mt-auto">
        <div className="bg-white dark:bg-neutral-950 rounded-tr-[2.5rem] py-5 pl-8 pr-12 flex items-center gap-4 border-t border-r border-neutral-100 dark:border-neutral-900">
          {testimonial.photoURL ? (
            <img
              src={testimonial.photoURL}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 flex items-center justify-center font-medium text-lg">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
              {testimonial.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingStars rating={testimonial.rating} maxRating={5} className="scale-75 origin-left -ml-1" />
              <span className="text-xs text-neutral-400 font-medium ml-1">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
