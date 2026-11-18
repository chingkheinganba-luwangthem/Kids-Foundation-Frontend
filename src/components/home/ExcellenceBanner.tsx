import React from "react";
import { Sparkles } from "lucide-react";
import { ExcellenceBannerData } from "@/types/strapi";

interface ExcellenceBannerProps {
  data?: ExcellenceBannerData | null;
}

export function ExcellenceBanner({ data }: ExcellenceBannerProps) {
  if (!data || (!data.heading && !data.yearsEmblem)) return null;

  const { yearsEmblem, yearsLabel, subtitle, heading, description } = data;

  return (
    <section
      aria-label={heading || "Excellence Banner"}
      className="relative z-10 bg-[#252D3F] bg-cover bg-center border-y border-white/10 py-7 sm:py-9 overflow-hidden"
      style={{ backgroundImage: "url('/images/new_bgg.png')" }}
    >
      <div className="absolute inset-0 bg-[#111827]/20 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
          
          {/* Milestone Golden Emblem */}
          {yearsEmblem && (
            <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#17345F] shadow-md shadow-[#FBBF24]/25 border-2 border-white ring-4 ring-[#FBBF24]/20">
              <div className="text-center">
                <span className="block text-2xl sm:text-[26px] font-black leading-none tracking-tight text-[#17345F]">
                  {yearsEmblem}
                </span>
                {yearsLabel && (
                  <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#17345F]/90 mt-0.5">
                    {yearsLabel}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Headline & Subtitle */}
          <div className="space-y-1">
            {subtitle && (
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#FBBF24]">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">
                  {subtitle}
                </span>
              </div>
            )}

            {heading && (
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-white tracking-tight leading-tight">
                {heading}
              </h2>
            )}

            {description && (
              <p className="text-xs sm:text-sm text-white/75 font-medium leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
