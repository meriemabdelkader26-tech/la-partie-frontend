# 🚀 influBridge - Influencer Marketing Platform

A modern full-stack platform connecting brands with influencers for authentic marketing campaigns. Built with Next.js 16, TypeScript, and GraphQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Key Features by Role](#key-features-by-role)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

## 🎯 Overview

influBridge is a comprehensive influencer marketing platform that facilitates collaboration between brands and social media influencers. The platform enables companies to create marketing campaigns, discover influencers, and manage collaborations, while influencers can browse opportunities, apply to campaigns, and showcase their portfolio.

## ✨ Features

### 🏢 For Companies

- **Campaign Management**: Create, edit, and delete marketing campaigns with full CRUD operations
- **Influencer Discovery**: Search and filter influencers by niche, location, and engagement metrics
- **Application Management**: Review, approve, or reject influencer applications
- **Analytics Dashboard**: Track campaign performance and application statistics
- **Profile Management**: Complete company profile with branding and requirements

### 👤 For Influencers

- **Campaign Discovery**: Browse available brand campaigns and opportunities
- **Application System**: Apply to campaigns that match your niche and audience
- **Portfolio Management**: Showcase Instagram posts and reels with metrics
- **Earnings Tracking**: Monitor campaign earnings and payment status
- **Analytics**: View profile analytics and engagement statistics
- **Profile Customization**: Complete profile with social media integration

### 🔐 Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- Role-based access control (Admin, Company, Influencer)
- Protected routes with middleware validation
- Email verification system
- Secure token refresh mechanism

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**:
  - [Zustand](https://zustand-demo.pmnd.rs/) for global state
  - [TanStack Query](https://tanstack.com/query/latest) for server state
- **Forms**: React Hook Form + Zod validation
- **API**: GraphQL with graphql-request
- **Animations**: Framer Motion + GSAP
- **UI Components**: Radix UI primitives

### Complete Dependencies

#### Production Dependencies

```json
{
  "@hookform/resolvers": "^5.2.2",
  "@radix-ui/react-alert-dialog": "^1.1.15",
  "@radix-ui/react-aspect-ratio": "^1.1.7",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.3",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-scroll-area": "^1.2.10",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.6",
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-switch": "^1.2.6",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-toggle": "^1.1.10",
  "@radix-ui/react-tooltip": "^1.2.8",
  "@tanstack/react-query": "^5.90.5",
  "@tanstack/react-query-devtools": "^5.90.2",
  "@tanstack/react-table": "^8.21.3",
  "@types/js-cookie": "^3.0.6",
  "axios": "^1.13.1",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "date-fns": "^4.1.0",
  "embla-carousel-autoplay": "^8.6.0",
  "embla-carousel-react": "^8.6.0",
  "framer-motion": "^12.23.24",
  "graphql": "^16.12.0",
  "graphql-request": "^7.3.1",
  "gsap": "^3.13.0",
  "input-otp": "^1.4.2",
  "js-cookie": "^3.0.5",
  "lucide-react": "^0.548.0",
  "next": "^16.1.0",
  "next-themes": "^0.4.6",
  "nextjs-toploader": "^3.9.17",
  "nuqs": "^2.7.2",
  "react": "19.2.0",
  "react-datepicker": "^8.8.0",
  "react-day-picker": "^9.11.1",
  "react-dom": "19.2.0",
  "react-hook-form": "^7.65.0",
  "react-phone-number-input": "^3.4.13",
  "react-quill-new": "^3.6.0",
  "sonner": "^2.0.7",
  "tailwind-merge": "^3.3.1",
  "zod": "^4.1.12",
  "zustand": "^5.0.8"
}
```

#### Development Dependencies

```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "^16.1.0",
  "tailwindcss": "^4",
  "tw-animate-css": "^1.4.0",
  "typescript": "^5"
}
```

### Package Highlights

- **UI Framework**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS 4 with custom animations
- **Data Fetching**: GraphQL via graphql-request
- **Animations**: Framer Motion & GSAP
- **Date Handling**: date-fns & react-day-picker
- **Tables**: TanStack Table
- **Notifications**: Sonner (toast notifications)
- **Editor**: React Quill (rich text editing)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- Backend API running (Django + GraphQL)

### Installation

1. **Clone the repository**

```bash
git https://github.com/LaithMahdi/influBridge_front.git
cd influBridge_front
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create `.env.local` for development:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/graphql
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=your_instagram_token
```

Create `.env.production` for production:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-api.com/graphql
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=your_instagram_token
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
influBridge_front/
├── public/                      # Static assets
│   └── tunisia-cities.json     # Location data
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin dashboard routes
│   │   ├── (authentification)/ # Auth routes (login, register, verify)
│   │   ├── (company)/         # Company dashboard routes
│   │   │   └── company/
│   │   │       ├── campaigns/      # Campaign CRUD
│   │   │       ├── complete-profile/
│   │   │       ├── dashboard/
│   │   │       ├── influencers/    # Influencer discovery
│   │   │       ├── messages/
│   │   │       └── profile/
│   │   ├── (influencer)/      # Influencer dashboard routes
│   │   │   └── influencer/
│   │   │       ├── analytics/
│   │   │       ├── campaigns/      # Browse opportunities
│   │   │       ├── complete-profile/
│   │   │       ├── earnings/
│   │   │       ├── messages/
│   │   │       ├── offer/
│   │   │       ├── portfolio/      # Instagram integration
│   │   │       ├── profile/
│   │   │       └── settings/
│   │   ├── api/               # API routes
│   │   ├── _components/       # Landing page components
│   │   ├── enums/            # TypeScript enums
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript types
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   │
│   ├── components/           # Reusable components
│   │   ├── shared/          # Shared business components
│   │   └── ui/              # shadcn/ui components
│   │
│   ├── config/              # Configuration files
│   ├── constant/            # Constants and enums
│   │
│   ├── lib/                 # Utility libraries
│   │   ├── api_client.ts         # API client setup
│   │   ├── graphql-client.ts     # GraphQL client
│   │   ├── instagram-api.ts      # Instagram API integration
│   │   ├── utils.ts              # Utility functions
│   │   ├── queries/              # GraphQL queries
│   │   └── types/                # API types
│   │
│   ├── providers/           # Context providers
│   │   └── TanStackQueryProvider.tsx
│   │
│   ├── stores/             # Zustand stores
│   │   ├── use-company-profile-form-store.ts
│   │   ├── use-profile-form-store.ts
│   │   └── use-session-store.ts
│   │
│   └── middleware.ts       # Route protection middleware
│
├── components.json         # shadcn/ui config
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## 👥 User Roles

### 1. **Influencer**

Access to:

- `/influencer/*` routes
- Campaign discovery and applications
- Portfolio management
- Earnings tracking
- Personal analytics

### 2. **Company**

Access to:

- `/company/*` routes
- Campaign creation and management
- Influencer discovery
- Application review system
- Company dashboard

### 3. **Admin**

Access to:

- `/admin/*` routes
- Platform management
- User oversight
- System analytics

## 🎯 Key Features by Role

### Company Dashboard Features

#### Campaign Management (Full CRUD)

- **Create**: Multi-step form with validation
  - Campaign details (title, objective, requirements)
  - Budget range configuration
  - Date range selection
  - Target influencer count
- **Read**: Detailed campaign view
  - Real-time statistics (applications, pending, approved)
  - Application management
  - Influencer profiles
- **Update**: Edit existing campaigns
  - Pre-filled forms
  - Same validation as create
- **Delete**: Safe deletion with confirmation
  - Modal confirmation dialog
  - Prevents accidental deletion

#### Application Management

- Filter by status (all, pending, approved, rejected)
- Search by influencer name
- Approve/reject applications
- View detailed influencer profiles
- Track application statistics

### Influencer Dashboard Features

#### Portfolio Management

- Instagram post integration
- Automatic reel fetching
- Engagement metrics display
- Media gallery with statistics

#### Campaign Discovery

- Browse available opportunities
- Filter by niche and location
- Apply to campaigns
- Track application status

#### Analytics

- Profile views
- Engagement rates
- Campaign performance
- Earnings overview

## 🔑 Environment Variables

### Required Variables

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=<GraphQL API endpoint>

# Instagram API (Optional - for portfolio features)
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=<Instagram Graph API token>
```

### Optional Variables

```env
# Analytics (if configured)
NEXT_PUBLIC_GA_ID=<Google Analytics ID>

# Feature Flags
NEXT_PUBLIC_ENABLE_INSTAGRAM=true
```

## 💻 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (if configured)
- **Zod**: Runtime schema validation

### Development Tools

- **TanStack Query Devtools**: Server state inspection
- **React DevTools**: Component inspection
- **TypeScript**: Type checking and IntelliSense

### Best Practices

1. **Component Organization**

   - Keep components small and focused
   - Use shared components for common UI patterns
   - Separate business logic from presentation

2. **State Management**

   - Use Zustand for global client state
   - Use TanStack Query for server state
   - Avoid prop drilling with context when needed

3. **Type Safety**

   - Define types for all API responses
   - Use Zod schemas for form validation
   - Leverage TypeScript strict mode

4. **Performance**
   - Implement proper loading states
   - Use Next.js Image component
   - Implement pagination for large lists
   - Optimize bundle size with code splitting

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. **Push to Git**

```bash
git push origin main
```

2. **Import to Vercel**

   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Configure environment variables
   - Deploy

3. **Set Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Redeploy if needed

### Build Configuration

The project uses:

- Next.js 16 with App Router
- Automatic code splitting
- Image optimization
- Static generation where possible

### Production Checklist

- [ ] Configure environment variables
- [ ] Set up proper CORS in backend
- [ ] Enable production error tracking
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and analytics
- [ ] Test all user flows
- [ ] Verify authentication flows
- [ ] Check responsive design on all devices

## 📚 Documentation

For more detailed documentation, see:

- [CRUD Operations Guide](CRUD_OFFERS_COMPLETE.md) - Detailed campaign management
- [Instagram Integration](INSTAGRAM_POSTS_IMPLEMENTATION.md) - Portfolio setup
- [Middleware Configuration](MIDDLEWARE.md) - Route protection
- [State Management](ZUSTAND_FORM_PERSISTENCE.md) - Form persistence

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation files in the project root

---

**Built with ❤️ using Next.js and TypeScript**
