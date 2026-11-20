import {
  GlobalSettingData,
  HeaderData,
  FooterData,
  HomePageData,
  AcademicStageData,
  NewsArticleData,
  GalleryItemData,
  StrapiMedia,
  AboutPageData,
  LearningPageData,
  CampusPageData,
  SportsArtsPageData,
  GalleryPageData,
  AdmissionPageData,
  EventsPageData,
  NewsPageData,
  PublicationsPageData,
  ClubsPageData,
  ContactPageData,
} from "@/types/strapi";

const RAW_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://admin.kidsfoundationimphal.com";
const STRAPI_URL = RAW_STRAPI_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");

/**
 * Validates whether an image URL is a valid, renderable path/URL for Next.js <Image />.
 * Returns false for arbitrary dummy text or malformed strings.
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Next.js public absolute path
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes(" ")) {
    return true;
  }
  // External or absolute URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
    try {
      const parsed = new URL(trimmed.startsWith("//") ? `https:${trimmed}` : trimmed);
      return Boolean(parsed.hostname);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Returns a guaranteed valid image URL, falling back to a safe default if invalid.
 */
export function getSafeImageUrl(
  url?: string | null,
  fallback: string = "/images/campus-aerial.jpg"
): string {
  if (isValidImageUrl(url)) {
    return (url as string).trim();
  }
  return fallback;
}

/**
 * Safely parses and normalizes array-like fields from Strapi (such as JSON fields,
 * comma-separated strings, or array of strings/objects).
 */
export function normalizeStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string"
          ? item.trim()
          : String(item?.name || item?.label || item?.title || item || "").trim()
      )
      .filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item ?? "").trim()).filter(Boolean);
        }
      } catch {
        // Fall back to splitting
      }
    }
    return trimmed
      .split(/[\r\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Returns full URL for a Strapi API path
 */
export function getStrapiURL(path: string = ""): string {
  return `${STRAPI_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Formats a Strapi media URL (prepends STRAPI_URL if it is a relative path)
 */
export function getStrapiMediaUrl(media?: any): string {
  if (!media) return "";
  if (typeof media === "string") {
    const trimmed = media.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
      return trimmed;
    }
    // Only prepend STRAPI_URL if it is a relative path or valid filename
    if (trimmed.startsWith("/") || (trimmed.includes(".") && !trimmed.includes(" "))) {
      return `${STRAPI_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
    }
    return "";
  }

  // Handle arrays if multiple files returned
  const target = Array.isArray(media) ? media[0] : media;
  if (!target) return "";

  const url =
    target.url ||
    target.data?.attributes?.url ||
    target.data?.url ||
    target.attributes?.url ||
    "";

  if (!url || typeof url !== "string") return "";
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://") || trimmedUrl.startsWith("//")) {
    return trimmedUrl;
  }
  if (trimmedUrl.startsWith("/") || (trimmedUrl.includes(".") && !trimmedUrl.includes(" "))) {
    return `${STRAPI_URL}${trimmedUrl.startsWith("/") ? trimmedUrl : `/${trimmedUrl}`}`;
  }
  return "";
}

/**
 * Generic fetcher for Strapi REST endpoints with ISR
 */
async function fetchStrapi<T>(endpoint: string, tags: string[] = []): Promise<T | null> {
  const url = getStrapiURL(`/api/${endpoint}`);
  const isDev = process.env.NODE_ENV === "development";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(process.env.STRAPI_API_TOKEN
          ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
          : {}),
      },
      ...(isDev
        ? { cache: "no-store" as RequestCache }
        : { next: { revalidate: 60, tags } }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[fetchStrapi] Non-OK response (${res.status} ${res.statusText}) for: ${url}`);
      return null;
    }

    const json = await res.json();
    if (!json?.data) return null;

    // Handle collection types (arrays)
    if (Array.isArray(json.data)) {
      return json.data.map((item: any) =>
        item.attributes ? { id: item.id, ...item.attributes } : item
      ) as T;
    }

    // Handle single types (objects)
    if (json.data.attributes) {
      return { id: json.data.id, ...json.data.attributes } as T;
    }

    return json.data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    // Ignore Next.js internal prerender completion cancellations to prevent log noise
    if (err?.digest === "HANGING_PROMISE_REJECTION" || err?.name === "AbortError") {
      return null;
    }
    // Strapi server unreachable in local dev or network failure: fail silently to local fallback
    console.warn(`[fetchStrapi] Network error for: ${url}`, err);
    return null;
  }
}

/**
 * Fetch Global Settings (Header, Footer, Branding, Contact Info)
 */
export async function getGlobalSettings(): Promise<GlobalSettingData | null> {
  return fetchStrapi<GlobalSettingData>("global-setting?populate=*", ["global-settings"]);
}

/**
 * Fetch Header Singleton Data (School Name, Logo, Nav Links, More Links, Action Buttons, Top Notice)
 */
export async function getHeaderData(): Promise<HeaderData | null> {
  return fetchStrapi<HeaderData>("header?populate=*", ["header"]);
}

/**
 * Fetch Footer Singleton Data (Tagline, CBSE, Logo, FooterBg, Quick Links, Important Links, Contacts, Socials)
 */
export async function getFooterData(): Promise<FooterData | null> {
  return fetchStrapi<FooterData>("footer?populate=*", ["footer"]);
}

/**
 * Fetch Home Page Singleton Data (Hero, Excellence Banner)
 */
export async function getHomePageData(): Promise<HomePageData | null> {
  return fetchStrapi<HomePageData>("home-page?populate=*", ["home-page"]);
}

/**
 * Fetch Academic Stages from Learning Page Singleton
 */
export async function getAcademicStages(): Promise<AcademicStageData[] | null> {
  const learningPage = await getLearningPageData();
  if (!learningPage?.stages) return null;
  return learningPage.stages.map((s, idx) => ({
    id: idx + 1,
    stageId: s.stageId,
    tabNumber: `0${idx + 1}.`,
    tabLabel: s.title.split("(")[0].trim(),
    subLabel: s.title,
    heading: s.title,
    description: Array.isArray(s.description) ? s.description.join(" ") : (s.description || s.boldIntro || ""),
    tags: s.activities || [],
    image: s.image,
    sortOrder: idx + 1,
    cta: {
      label: "Explore Stage →",
      href: `/learning#${s.stageId}`,
    },
  }));
}

/**
 * Fetch News Articles from News Page Singleton
 */
export async function getNewsArticles(): Promise<NewsArticleData[] | null> {
  const newsPage = await getNewsPageData();
  if (!newsPage?.articles) return null;
  return newsPage.articles.map((a, idx) => ({
    id: a.id || idx + 1,
    title: a.title,
    slug: a.newsId || `news-${a.id || idx}`,
    publishedDate: a.date,
    category: a.category === "events" ? "events" : "news",
    excerpt: a.subtitle || (a.fullContent ? a.fullContent[0] : ""),
    coverImage: a.noticeImage,
  }));
}

/**
 * Fetch Curated Gallery Items from Gallery Page Singleton
 */
export async function getGalleryItems(): Promise<GalleryItemData[] | null> {
  const galleryPage = await getGalleryPageData();
  if (!galleryPage?.images) return null;
  const sorted = [...galleryPage.images].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  return sorted.slice(0, 6).map((img, idx) => ({
    id: img.id || idx + 1,
    title: img.title,
    category: (img.category || "Campus") as any,
    image: img.image,
    sortOrder: idx + 1,
    isFeaturedOnHome: true,
  }));
}

/**
 * Fetch About Page Singleton Data (Story, Pillars, Founder's Message)
 */
export async function getAboutPageData(): Promise<AboutPageData | null> {
  return fetchStrapi<AboutPageData>("about-page?populate=*", ["about-page"]);
}

/**
 * Fetch Learning Page Singleton Data (Approach Intro, Stages & Activities)
 */
export async function getLearningPageData(): Promise<LearningPageData | null> {
  return fetchStrapi<LearningPageData>("learning-page?populate=*", ["learning-page"]);
}

/**
 * Fetch Campus Page Singleton Data (Intro, Facilities, Gallery, Virtual Tour)
 */
export async function getCampusPageData(): Promise<CampusPageData | null> {
  return fetchStrapi<CampusPageData>("campus-page?populate=*", ["campus-page"]);
}

/**
 * Fetch Sports & Arts Page Singleton Data (Activities, Facilities Callout, Gallery)
 */
export async function getSportsArtsPageData(): Promise<SportsArtsPageData | null> {
  return fetchStrapi<SportsArtsPageData>("sports-and-arts-page?populate=*", ["sports-and-arts-page"]);
}

/**
 * Fetch Gallery Page Singleton Data (Banner, Section Header, Categories, Photos)
 */
export async function getGalleryPageData(): Promise<GalleryPageData | null> {
  return fetchStrapi<GalleryPageData>("gallery-page?populate=*", ["gallery-page"]);
}

/**
 * Fetch Admission Page Singleton Data (Enquiry, Procedures, Fee Structure Tables)
 */
export async function getAdmissionPageData(): Promise<AdmissionPageData | null> {
  return fetchStrapi<AdmissionPageData>("admission-page?populate=*", ["admission-page"]);
}

/**
 * Fetch Events Page Singleton Data (Banner, Filters, Event Cards)
 */
export async function getEventsPageData(): Promise<EventsPageData | null> {
  return fetchStrapi<EventsPageData>("events-page?populate=*", ["events-page"]);
}

/**
 * Fetch News and Updates Page Singleton Data (Banner, Categories, Notices)
 */
export async function getNewsPageData(): Promise<NewsPageData | null> {
  return fetchStrapi<NewsPageData>("news-page?populate=*", ["news-page"]);
}

/**
 * Fetch Publications Page Singleton Data (Banner, Categories, Handbooks, Magazines)
 */
export async function getPublicationsPageData(): Promise<PublicationsPageData | null> {
  return fetchStrapi<PublicationsPageData>("publications-page?populate=*", ["publications-page"]);
}

/**
  * Fetch Clubs & Activities Page Singleton Data (Banner, Categories, Clubs List)
  */
export async function getClubsPageData(): Promise<ClubsPageData | null> {
  return fetchStrapi<ClubsPageData>("clubs-page?populate=*", ["clubs-page"]);
}

/**
  * Fetch Contact Page Singleton Data (Banner, Contact Items, Form info, Map)
  */
export async function getContactPageData(): Promise<ContactPageData | null> {
  return fetchStrapi<ContactPageData>("contact-page?populate=*", ["contact-page"]);
}



