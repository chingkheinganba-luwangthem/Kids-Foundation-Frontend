export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderAction {
  label: string;
  href: string;
  variant: "outline" | "solid";
}

export interface AcademicStage {
  id: string;
  tabNumber: string;
  tabLabel: string;
  subLabel: string;
  heading: string;
  description: string;
  tags: string[];
  linkText: string;
  linkHref: string;
  image: string;
  imageAlt: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "events" | "news";
  image: string;
  imageAlt: string;
  linkHref: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category?: string;
  image: string;
  imageAlt: string;
  position?: string;
}

export interface ContactInfo {
  address: string;
  mobile: string[];
  phone: string;
  email: string;
  cbseAffiliationNo: string;
  estdYear: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "youtube";
  href: string;
  label: string;
}

export interface Club {
  id: string;
  name: string;
  tagline?: string;
  category: "STEM & Robotics" | "Language & Arts" | "Environment & Social" | "Performing Arts & Music" | "Sports & Wellness" | "Leadership & Debate" | string;
  gradeLevel?: string;
  meetingSchedule?: string;
  location?: string;
  mentor?: string;
  mentorRole?: string;
  membersCount?: number;
  description: string;
  badgeColor?: string;
  accentGradient?: string;
  image: string;
  keyActivities?: string[];
  learningOutcomes?: string[];
  recentHighlight?: string;
}

export interface Publication {
  id: string;
  title: string;
  category: "Magazine & Newsletter" | "Academic Handbook" | "Annual Report" | "Parent & Student Guide" | string;
  edition: string;
  publishedDate: string;
  academicYear: string;
  pages: number;
  fileSize: string;
  format: string;
  language: string;
  description: string;
  highlights: string[];
  coverImage?: string;
  pdfUrl?: string;
  downloadFileName: string;
  editorOrAuthor: string;
  featured?: boolean;
}

export interface NewsUpdateItem {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  subtitle?: string;
  category: "Circulars & Notices" | "Academic & Exams" | "Admissions" | "Achievements" | "Events & Culture" | "Governance" | string;
  hasDocument: boolean;
  documentName?: string;
  documentSize?: string;
  documentType?: string;
  documentUrl?: string;
  sortId?: number;
  fullContent?: string[];
  noticeImage?: string;
  isLatest?: boolean;
}

