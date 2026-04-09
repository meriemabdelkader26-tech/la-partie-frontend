export const STEPS = [
  {
    number: 1,
    slug: "fetching-instagram",
    title: "Instagram",
    description: "Connect your Instagram account",
  },
  {
    number: 2,
    slug: "instagram-posts",
    title: "Instagram Posts",
    description: "Select your best posts",
  },
  {
    number: 3,
    slug: "profile-info",
    title: "Profile Info",
    description: "Add your biography and location",
  },
  {
    number: 4,
    slug: "languages-content",
    title: "Languages & Content",
    description: "Select languages and content types",
  },
  {
    number: 5,
    slug: "social-networks",
    title: "Social Network Stats",
    description: "Add your main social network statistics",
  },
  {
    number: 6,
    slug: "categories",
    title: "Categories",
    description: "Choose your content categories",
  },
  {
    number: 7,
    slug: "collaboration-offers",
    title: "Collaboration Offers",
    description: "Define your collaboration packages",
  },
  {
    number: 8,
    slug: "portfolio",
    title: "Portfolio & Reels",
    description: "Showcase your Instagram reels",
  },
  {
    number: 9,
    slug: "images",
    title: "Profile Images",
    description: "Upload your profile images",
  },
  {
    number: 10,
    slug: "review",
    title: "Review",
    description: "Review and submit",
  },
];

export const getStepBySlug = (slug: string) => {
  return STEPS.find((step) => step.slug === slug);
};

export const getStepByNumber = (number: number) => {
  return STEPS.find((step) => step.number === number);
};

export const CONTENT_TYPES = [
  "Photo",
  "Video",
  "Reels",
  "Stories",
  "Live",
  "Carousel",
  "Blog",
  "Podcast",
];
