import React from "react";
import type { Metadata } from "next";
import { getEventsPageData, getStrapiMediaUrl, normalizeStringArray, getSafeImageUrl } from "@/lib/strapi";
import { formatDisplayDate } from "@/lib/newsHelper";
import { EventsClient, EventItem } from "@/components/events/EventsClient";

export const metadata: Metadata = {
  title: "School Events & Activities | Kids' Foundation",
  description:
    "Stay informed about upcoming and past school events, sports meets, cultural celebrations, academic exhibitions, and parent forums at Kids' Foundation, Imphal.",
};

function parseDateParts(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    const parts = dateStr.split(" ");
    return {
      month: parts[0]?.slice(0, 3) ?? "Jan",
      day: parts[1]?.replace(",", "") ?? "01",
      year: parts[2] ?? "2026",
    };
  }
  return {
    month: d.toLocaleString("en-US", { month: "short" }),
    day: String(d.getDate()).padStart(2, "0"),
    year: String(d.getFullYear()),
  };
}

export default async function EventsPage() {
  const strapiData = await getEventsPageData();

  const bannerTitle = strapiData?.bannerTitle ?? "";
  const breadcrumb = normalizeStringArray(strapiData?.breadcrumb);
  const sectionLabel = strapiData?.sectionLabel ?? "";
  const sectionHeading = strapiData?.sectionHeading ?? "";
  const filterOptions = normalizeStringArray(strapiData?.filterOptions);

  const events: EventItem[] =
    strapiData?.events?.map((ev, idx) => {
            const rawDate = ev.date;
            const { month, day, year } = parseDateParts(rawDate);
            const rawId = typeof ev.id === "number" ? ev.id : idx;
            const tag: "upcoming" | "past" = ev.tag;
            return {
              id: ev.eventId || String(ev.id || `event-${idx}`),
              rawId,
              rawDate,
              date: formatDisplayDate(rawDate) || rawDate,
              month: ev.month || month,
              day: ev.day || day,
              year: ev.year || year,
              title: ev.title,
              description: ev.description,
              category: ev.category,
              image: getSafeImageUrl(getStrapiMediaUrl(ev.image) || ev.imageUrl, "/images/campus-aerial.jpg"),
              imageAlt: ev.imageAlt || ev.title,
              time: ev.time,
              venue: ev.venue,
              tag,
            };
          })
          .sort((a, b) => {
            // 1. Upcoming events on top of all
            const aIsUpcoming = a.tag === "upcoming" ? 1 : 0;
            const bIsUpcoming = b.tag === "upcoming" ? 1 : 0;
            if (bIsUpcoming !== aIsUpcoming) {
              return bIsUpcoming - aIsUpcoming;
            }
            // 2. Latest upload on top
            const idDiff = (b.rawId ?? 0) - (a.rawId ?? 0);
            if (idDiff !== 0) return idDiff;
            // 3. Fallback to event date
            const aTime = new Date(a.rawDate).getTime() || 0;
            const bTime = new Date(b.rawDate).getTime() || 0;
            return bTime - aTime;
          }) ?? [];

  return (
    <EventsClient
      bannerTitle={bannerTitle}
      breadcrumb={breadcrumb}
      sectionLabel={sectionLabel}
      sectionHeading={sectionHeading}
      filterOptions={filterOptions}
      events={events}
    />
  );
}
