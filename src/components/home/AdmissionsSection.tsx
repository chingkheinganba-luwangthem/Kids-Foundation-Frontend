import React from "react";
import Link from "next/link";
import { AdmissionsCtaData } from "@/types/strapi";

interface AdmissionsSectionProps {
  data?: AdmissionsCtaData | null;
}

export function AdmissionsSection({ data }: AdmissionsSectionProps) {
  if (!data) return null;

  const { label, heading, description } = data;
  const primaryBtn = {
    label: data.primaryCta?.label ?? "",
    href: data.primaryCta?.href ?? "#",
  };
  const secondaryBtn = {
    label: data.secondaryCta?.label ?? "",
    href: data.secondaryCta?.href ?? "#",
  };

  if (!heading && !description && !primaryBtn.label && !secondaryBtn.label) {
    return null;
  }

  return (
    <section
      id="admissions"
      className="pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 text-center"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        {label && (
          <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
            {label}
          </span>
        )}

        {heading && (
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight mb-3 sm:mb-4 whitespace-pre-line">
            {heading}
          </h2>
        )}

        {description && (
          <p className="text-sm sm:text-base text-[#475569] max-w-xl mx-auto leading-[1.8] sm:leading-[1.85] mb-6 sm:mb-8">
            {description}
          </p>
        )}

        {/* Buttons */}
        {(primaryBtn.label || secondaryBtn.label) && (
          <div className="flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            {primaryBtn.label && (
              <Link
                href={primaryBtn.href}
                className="inline-flex w-full max-w-[280px] items-center justify-center bg-[#F47C61] hover:bg-[#E0684E] text-white text-xs sm:w-[220px] sm:max-w-none sm:text-sm font-semibold px-6 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 active:scale-98"
              >
                {primaryBtn.label}
              </Link>
            )}

            {secondaryBtn.label && (
              <Link
                href={secondaryBtn.href}
                className="inline-flex w-full max-w-[280px] items-center justify-center bg-white/80 hover:bg-white text-[#17345F] text-xs sm:w-[220px] sm:max-w-none sm:text-sm font-semibold px-6 py-2.5 rounded-full border border-slate-300/80 transition-all duration-200 active:scale-98 shadow-xs"
              >
                {secondaryBtn.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
