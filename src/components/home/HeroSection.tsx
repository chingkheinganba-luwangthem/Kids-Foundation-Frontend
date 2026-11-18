"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { HeroSectionData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface HeroSectionProps {
  data?: HeroSectionData | null;
}

export function HeroSection({ data }: HeroSectionProps) {
  const heroBadge = data?.badge ?? "";
  const heroHeadingLine1 = data?.headingLine1 ?? "";
  const heroHeadingLine2 = data?.headingLine2 ?? "";
  const heroDescription = data?.description ?? "";
  const heroPrimaryBtn = {
    label: data?.primaryCta?.label ?? "",
    href: data?.primaryCta?.href ?? "#",
  };
  const heroSecondaryBtn = {
    label: data?.secondaryCta?.label ?? "",
    href: data?.secondaryCta?.href ?? "#",
  };
  const validSlides =
    data?.slides && data.slides.length > 0
      ? data.slides
          .map((s) => ({
            src: getStrapiMediaUrl(s.media),
            alt: s.alt || "Kids' Foundation School",
          }))
          .filter((s) => Boolean(s.src))
      : [];

  const slides = validSlides;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  if (slides.length === 0) return null;

  // Keep index within bounds if slide count changes
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(nextSlide, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      id="hero"
      className="relative min-h-[580px] sm:min-h-[680px] lg:min-h-[780px] flex flex-col justify-between pt-28 sm:pt-36 lg:pt-44 pb-10 sm:pb-12 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={`${slide.src}-${index}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === current ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
              unoptimized={slide.src.endsWith(".gif") || slide.src.includes(".gif")} // Important for animated GIF
            />
          </div>
        ))}

        {/* Navy gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17345F] via-[#17345F]/85 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17345F]/75 via-transparent to-[#17345F]/35" />
      </div>

      {/* Spacer for vertical balance */}
      <div className="h-2 sm:h-4" />

      {/* Hero Content - Left Aligned */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] w-full">
        <div className="max-w-2xl text-left">
          {/* Badge */}
          {heroBadge && (
            <div className="inline-block mb-3 sm:mb-4">
              <span className="text-[#FBBF24] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase">
                {heroBadge}
              </span>
            </div>
          )}

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-xs">
            {heroHeadingLine1}
            {heroHeadingLine2 ? (
              <>
                <br />
                {heroHeadingLine2}
              </>
            ) : null}
          </h1>

          {/* Description */}
          {heroDescription && (
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/85 max-w-xl font-normal leading-relaxed">
              {heroDescription}
            </p>
          )}

          {/* Action Buttons */}
          {(heroPrimaryBtn.label || heroSecondaryBtn.label) && (
            <div className="mt-7 sm:mt-8 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-start">
              {heroPrimaryBtn.label && (
                <Link
                  href={heroPrimaryBtn.href}
                  className="inline-flex w-full max-w-[280px] items-center justify-center bg-[#F47C61] hover:bg-[#E0684E] text-white text-xs sm:w-[220px] sm:max-w-none sm:text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
                >
                  {heroPrimaryBtn.label}
                </Link>
              )}

              {heroSecondaryBtn.label && (
                <Link
                  href={heroSecondaryBtn.href}
                  className="inline-flex w-full max-w-[280px] items-center justify-center bg-white/10 hover:bg-white/20 text-white text-xs sm:w-[220px] sm:max-w-none sm:text-sm font-medium px-6 py-3 rounded-full border border-white/35 backdrop-blur-xs transition-all duration-200 active:scale-98"
                >
                  {heroSecondaryBtn.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compact slider navigation */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] pt-4 pb-2">
        <div className="flex justify-end items-center pb-1">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Previous Arrow */}
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm cursor-pointer active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={cn(
                      "h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer",
                      index === current
                        ? "w-5 sm:w-6 bg-[#FBBF24]"
                        : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
                    )}
                  />
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm cursor-pointer active:scale-95 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
          </div>
        </div>
      </div>
    </section>
  );
}
