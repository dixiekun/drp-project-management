# Freelance Project Management Platform

A modern, minimalist client and project management web application built for freelance web designers.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Turso (LibSQL)
- **ORM**: Drizzle
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Language**: TypeScript

## Features

- ✅ User authentication with Clerk
- ✅ Modern, minimalist UI
- ✅ Responsive dashboard layout
- 🚧 Client management
- 🚧 Project tracking
- 🚧 Kanban task board
- 🚧 Time tracking
- 🚧 Team collaboration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- A Turso account (free tier available)
- A Clerk account (free tier available)

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Turso Database

1. Install Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Sign up and create a database:
```bash
turso auth signup
turso db create drp-project-management
```

3. Get your database URL and auth token:
```bash
turso db show drp-project-management
turso db tokens create drp-project-management
```

### 3. Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Get your API keys from the dashboard

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (from Turso)
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Clerk Authentication (from Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 5. Set Up Database Schema

Generate and push the database schema:

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard layout and pages
│   ├── layout.tsx         # Root layout with Clerk
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components (Sidebar, TopNav)
├── db/
│   ├── schema/            # Drizzle schema definitions
│   ├── migrations/        # Database migrations
│   └── index.ts           # Database client
├── lib/
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── actions/               # Server actions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Database Schema

### Core Tables

- **users** - User accounts (synced with Clerk)
- **clients** - Client information and metadata
- **projects** - Project details with budget and milestones
- **tasks** - Task management with rich JSON content

See `planning/database-schema.md` for complete schema documentation.

## Design System

Following a clean, minimalist aesthetic:

- **Colors**: Neutral grays with blue accents
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Components**: Shadcn/ui based

See `planning/ui-ux-design.md` for complete design guidelines.

## Development Roadmap

See `planning/implementation-phases.md` for the complete development timeline.

### Current Status: Phase 0 Complete ✅

- [x] Project initialization
- [x] Database setup
- [x] Authentication
- [x] Base layout and components

### Next Steps

1. **Phase 1**: Client and Project CRUD operations
2. **Phase 2**: Kanban board with drag-and-drop
3. **Phase 3**: Comments and collaboration
4. **Phase 4**: Time tracking and files

## Contributing

This is a private project. For questions or issues, please contact the project owner.

## License

Private - All rights reserved
