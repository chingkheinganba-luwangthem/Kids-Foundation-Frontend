import React from "react";
import { Metadata } from "next";
import { getPublicationsPageData, getStrapiMediaUrl } from "@/lib/strapi";
import { formatDisplayDate } from "@/lib/newsHelper";
import { Publication } from "@/types";
import { PublicationsClient } from "@/components/publications/PublicationsClient";

export const metadata: Metadata = {
  title: "Publications | Kids' Foundation School",
  description:
    "Official publications, annual magazines, student anthologies, curriculum blueprints, and academic handbooks from Kids' Foundation School, Imphal.",
};

export default async function PublicationsPage() {
  const strapiData = await getPublicationsPageData();

  const publications: Publication[] =
    strapiData?.publications?.map((pub, idx) => ({
          id: pub.pubId || `pub-${pub.id || idx}`,
          title: pub.title,
          category: pub.category as Publication["category"],
          edition: pub.edition ?? "",
          publishedDate: formatDisplayDate(pub.publishedDate) || pub.publishedDate || "",
          academicYear: pub.academicYear ?? "",
          pages: pub.pages ?? 0,
          fileSize: pub.fileSize ?? "",
          format: pub.format ?? "",
          language: pub.language ?? "",
          description: pub.description ?? "",
          highlights: pub.highlights ?? [],
          coverImage: pub.coverImageUrl || getStrapiMediaUrl(pub.coverImage) || "",
          pdfUrl: getStrapiMediaUrl(pub.pdfFile) || undefined,
          downloadFileName: pub.downloadFileName ?? "",
          editorOrAuthor: pub.editorOrAuthor ?? "",
          featured: pub.featured ?? false,
        }))
      .filter((publication) => Boolean(publication.coverImage)) ?? [];

  return (
    <PublicationsClient
      bannerTitle={strapiData?.bannerTitle ?? ""}
      breadcrumb={strapiData?.breadcrumb ?? []}
      bannerImage={
        strapiData?.bannerImageUrl ||
        getStrapiMediaUrl(strapiData?.bannerImage) ||
        undefined
      }
      sectionHeading={strapiData?.sectionHeading}
      sectionDescription={strapiData?.sectionDescription}
      categories={strapiData?.categories ?? []}
      publications={publications}
    />
  );
}
