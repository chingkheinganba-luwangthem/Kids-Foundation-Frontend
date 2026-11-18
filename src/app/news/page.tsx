import React from "react";
import { Metadata } from "next";
import { getNewsPageData } from "@/lib/strapi";
import { NewsUpdateItem } from "@/types";
import { NewsClient } from "@/components/news/NewsClient";
import { formatAndSortNewsArticles } from "@/lib/newsHelper";

export const metadata: Metadata = {
  title: "News & Updates | Kids' Foundation School",
  description:
    "Stay updated with verified circulars, board examination schedules, admission announcements, and student accolades from Kids' Foundation School.",
};

export default async function NewsPage() {
  const strapiData = await getNewsPageData();

  const thresholdDays = strapiData?.latestDaysThreshold ?? 14;

  const articles: NewsUpdateItem[] =
    strapiData?.articles
      ? formatAndSortNewsArticles(strapiData.articles, thresholdDays)
      : [];

  return (
    <NewsClient
      bannerTitle={strapiData?.bannerTitle ?? ""}
      breadcrumb={strapiData?.breadcrumb ?? []}
      sectionLabel={strapiData?.sectionLabel ?? ""}
      sectionHeading={strapiData?.sectionHeading ?? ""}
      categories={strapiData?.categories ?? []}
      articles={articles}
    />
  );
}
