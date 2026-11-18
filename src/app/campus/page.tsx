import React from "react";
import type { Metadata } from "next";
import { getCampusPageData, getStrapiMediaUrl } from "@/lib/strapi";
import { CampusClient } from "@/components/campus/CampusClient";

export const metadata: Metadata = {
  title: "Campus Facilities & Tour | Kids' Foundation",
  description:
    "Explore the spacious 2-acre campus, modern facilities, sports grounds, science labs, and classrooms at Kids' Foundation School, Imphal.",
};

export default async function CampusPage() {
  const strapiData = await getCampusPageData();

  const banner = {
    title: strapiData?.pageTitle ?? "",
    breadcrumb: strapiData?.breadcrumb ?? [],
  };

  const intro = {
    heading: strapiData?.introHeading ?? "",
    title: strapiData?.introTitle ?? "",
    description: strapiData?.introDescription ?? "",
    facilities: strapiData?.facilities ?? [],
  };

  const galleryImages =
    strapiData?.galleryImages
      ?.map((img) => ({
        src: getStrapiMediaUrl(img.image) || img.imageUrl || "",
        alt: img.alt || img.title || "",
      }))
      .filter((image) => Boolean(image.src)) ?? [];

  const video = {
    title: strapiData?.videoTitle ?? "",
    youtubeId: strapiData?.youtubeId ?? "",
    description: strapiData?.videoDescription ?? "",
  };

  return (
    <CampusClient
      banner={banner}
      intro={intro}
      galleryImages={galleryImages}
      video={video}
    />
  );
}
