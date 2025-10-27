# Tech Stack

## Core Technologies

### Database & ORM

**Turso (LibSQL)**
- Serverless SQLite-compatible database
- Edge deployment capabilities
- Cost-effective for small to medium projects
- Built-in replication

**Drizzle ORM**
- TypeScript-first ORM with excellent type safety
- Lightweight and performant
- SQL-like query builder
- Great migration system
- Perfect for Turso integration

### Frontend Framework

**Next.js 14+ (App Router)**
- React-based full-stack framework
- Server Components for performance
- Built-in API routes
- Excellent developer experience
- Great for SEO and performance

### Styling & UI

**Tailwind CSS**
- Utility-first CSS framework
- Rapid development
- Consistent design system
- Small bundle size with purging

**Shadcn/ui**
- High-quality, accessible components
- Built on Radix UI primitives
- Customizable and composable
- Matches minimalist aesthetic

### State Management

**Zustand** (recommended)
- Lightweight (1kb)
- Simple API
- Great TypeScript support
- No boilerplate

*Alternative: React Context + useReducer for simpler needs*

### Form Handling

**React Hook Form**
- Performant form handling
- Minimal re-renders
- Great DX

**Zod**
- TypeScript-first schema validation
- Runtime type checking
- Works seamlessly with React Hook Form

### Drag & Drop

**@dnd-kit/core**
- Modern drag-and-drop library
- Accessible
- Touch-friendly
- Flexible API for Kanban boards

### Rich Text Editing

**Tiptap** (recommended)
- Extensible rich text editor
- JSON-based output (perfect for our needs)
- Collaborative editing support
- Framework agnostic

*Alternative: Lexical (Meta's framework-agnostic editor)*

### Date Handling

**date-fns**
- Modular date utility library
- Tree-shakeable
- Smaller than moment.js
- Great TypeScript support

### Authentication

**Clerk** (recommended)
- Full-featured auth solution
- User management UI
- Social logins
- Organizations/teams support

*Alternative: NextAuth.js for more control*

### Additional Libraries

- **Lucide React**: Icon library
- **Recharts**: Analytics charts and visualizations
- **React Query**: Server state management and caching
- **Sonner**: Toast notifications
- **Vaul**: Drawer component for mobile
- **cmdk**: Command palette for keyboard shortcuts

## Development Tools

- **TypeScript**: Type safety throughout
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Turbo**: Monorepo build system (if needed later)

## Deployment

- **Vercel**: Frontend hosting (optimized for Next.js)
- **Turso**: Database (already serverless)
- **Vercel Blob**: File storage for assets

## Why This Stack?

1. **Type Safety**: TypeScript + Drizzle + Zod = end-to-end type safety
2. **Performance**: Server Components, edge functions, optimized React
3. **Developer Experience**: Modern tooling, great documentation
4. **Scalability**: Can grow from MVP to production-ready app
5. **Cost-Effective**: Free tiers available for most services
6. **JSON-First**: Tiptap and flexible schema design support content flexibility
