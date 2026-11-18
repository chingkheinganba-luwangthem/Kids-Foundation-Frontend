import React from "react";
import { Metadata } from "next";
import { getClubsPageData, getStrapiMediaUrl } from "@/lib/strapi";
import { Club } from "@/types";
import { ClubsClient } from "@/components/clubs/ClubsClient";

export const metadata: Metadata = {
  title: "Clubs & Activities | Kids' Foundation School",
  description:
    "Explore student clubs and societies at Kids' Foundation School, cultivating curiosity, leadership, debate, arts, athletics, and STEM skills.",
};

export default async function ClubsAndActivitiesPage() {
  const strapiData = await getClubsPageData();

  const clubs: Club[] =
    strapiData?.clubs?.map((c, idx) => ({
          id: c.clubId || `club-${c.id || idx}`,
          name: c.name,
          category: c.category as Club["category"],
          meetingSchedule: c.meetingSchedule ?? "",
          location: c.location ?? "",
          mentor: c.mentor ?? "",
          mentorRole: c.mentorRole ?? "",
          membersCount: c.membersCount ?? 0,
          badgeColor: c.badgeColor ?? "",
          accentGradient: c.accentGradient ?? "",
          image: c.imageUrl || getStrapiMediaUrl(c.image) || "",
          description: c.description,
          recentHighlight: c.recentHighlight ?? "",
        }))
      .filter((club) => Boolean(club.image)) ?? [];

  return (
    <ClubsClient
      bannerTitle={strapiData?.bannerTitle ?? ""}
      breadcrumb={strapiData?.breadcrumb ?? []}
      bannerImage={
        strapiData?.bannerImageUrl ||
        getStrapiMediaUrl(strapiData?.bannerImage) ||
        undefined
      }
      overviewHeading={strapiData?.overviewHeading}
      overviewDescription={strapiData?.overviewDescription}
      categories={strapiData?.categories ?? []}
      clubs={clubs}
    />
  );
}
