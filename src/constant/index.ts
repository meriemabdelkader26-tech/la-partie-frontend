import { DisponibiliteEnum } from "@/app/enums";

export const APP_NAME: string = "influBridge";
export const APP_DESCRIPTION: string =
  "Connect, collaborate, and grow your creative business";

export const APP_COLOR: string = "#CE6A6B";

export const CATEGORIES_LIST_KEY = "categories_list";

export const CATEGORIES_KEY = "categories";

export const USERS_KEY = "users";

export const OFFERS_KEY = "offers";

export const INFLUENCERS_KEY = "influencers";

export const INFLUENCER_SERVICES = [
  "Showcase your portfolio and reach",
  "Connect with brands seeking partnerships",
  "Manage collaborations and campaigns",
  "Track performance and analytics",
];

export const BRAND_SERVICES = [
  "Discover influencers that align with your brand",
  "Easily manage multiple influencer campaigns",
  "Access detailed analytics and ROI tracking",
  "Streamline communication and collaboration",
];

export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Fashion Influencer",
    content: `${APP_NAME} helped me connect with amazing brands and grow my collaborations. The platform is so easy to use!`,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "Alex Rodriguez",
    role: "Beauty Creator",
    content:
      "The analytics dashboard is incredible. I can track every collaboration and see exactly what's working.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    name: "Emma Thompson",
    role: "Brand Manager",
    content:
      "Finding the right influencers used to take weeks. Now I can discover perfect matches in minutes.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
];

export const TOP_COMPANIES = [
  { name: "Nike", logo: "🏃" },
  { name: "Adidas", logo: "⚽" },
  { name: "Puma", logo: "🐆" },
  { name: "Gucci", logo: "👜" },
  { name: "Zara", logo: "👗" },
  { name: "H&M", logo: "🛍️" },
  { name: "Sephora", logo: "💄" },
  { name: "Starbucks", logo: "☕" },
];

export const CAROUSEL = [
  {
    title: "Influencer Dashboard",
    description:
      "Manage your profile, collaborations, and analytics in one place",
    image: "/influencer-dashboard-interface.jpg",
  },
  {
    title: "Brand Discovery",
    description: "Find the perfect influencers that match your brand values",
    image: "/brand-discovery-search-interface.jpg",
  },
  {
    title: "Campaign Management",
    description: "Track campaigns, monitor performance, and measure ROI",
    image: "/campaign-analytics-dashboard.png",
  },
];

export const FOOTER_SECTIONS = [
  {
    title: APP_NAME,
    description: "Connecting influencers with brands worldwide",
    links: [],
  },
  {
    title: "For Influencers",
    links: [
      { label: "Sign Up", href: "#" },
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "For Brands",
    links: [
      { label: "Sign Up", href: "#" },
      { label: "Find Influencers", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
];

export const ITEMS_PER_PAGE = 10;

export const LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "German",
  "Italian",
  "Portuguese",
  "Arabic",
  "Chinese",
  "Japanese",
  "Korean",
];

export const DISPONIBILITE_CHOICES = [
  { label: "Available", value: DisponibiliteEnum.DISPONIBLE },
  { label: "Busy", value: DisponibiliteEnum.OCCUPE },
  {
    label: "Partially available",
    value: DisponibiliteEnum.PARTIELLEMENT_DISPONIBLE,
  },
];
