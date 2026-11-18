import React from "react";
import type { Metadata } from "next";
import { getGalleryPageData, getStrapiMediaUrl } from "@/lib/strapi";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Photo Gallery | Kids' Foundation",
  description:
    "Explore photos and memories of campus life, academics, sports, culture, and events at Kids' Foundation School, Imphal.",
};

export default async function GalleryPage() {
  const strapiData = await getGalleryPageData();

  const banner = {
    title: strapiData?.bannerTitle ?? "",
    breadcrumb: strapiData?.breadcrumb ?? [],
  };

  const sectionHeader = {
    label: strapiData?.sectionLabel ?? "",
    heading: strapiData?.sectionHeading ?? "",
    description: strapiData?.sectionDescription ?? "",
  };

  const categories =
    strapiData?.categories ?? [];

  const images =
    strapiData?.images
      ?.map((img, idx) => ({
          id: img.id || `gal-${idx}`,
          src: getStrapiMediaUrl(img.image) || img.imageUrl || "",
          alt: img.alt || img.title,
          category: img.category,
          title: img.title,
        }))
      .filter((image) => Boolean(image.src)) ?? [];

  return (
    <GalleryClient
      banner={banner}
      sectionHeader={sectionHeader}
      categories={categories}
      images={images}
    />
  );
}
