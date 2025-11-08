# AI Rules for Financial Control App

## Tech Stack

- **Next.js 15** - React framework with App Router for server-side rendering and static site generation
- **TypeScript 5** - Static type checking for JavaScript with full type safety
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **Prisma** - Modern database ORM for type-safe database access
- **shadcn/ui** - High-quality, accessible UI components built on Radix UI
- **React Hook Form + Zod** - Form handling with validation using TypeScript-first schemas
- **TanStack Query** - Server state management for data fetching and caching
- **Zustand** - Lightweight state management for client-side state
- **Lucide React** - Beautiful, consistent icon library
- **Recharts** - React charting library for data visualization
- **Framer Motion** - Production-ready motion library for animations
- **Socket.IO** - Real-time bidirectional communication
- **NextAuth.js** - Authentication and session management

## Library Usage Rules

### UI Components
- **Always use shadcn/ui components** for all UI elements
- **Never create custom UI components** when shadcn/ui equivalents exist
- **Import components directly** from `@/components/ui/`
- **Use Tailwind CSS classes** for all styling, never inline styles
- **Follow the existing design system** with consistent colors, spacing, and typography

### Forms and Validation
- **Use React Hook Form** for all form handling
- **Use Zod schemas** for all form validation
- **Create form schemas** in separate files with `.schema.ts` extension
- **Use `useForm` hook** with resolver for Zod schemas
- **Never use controlled inputs** without React Hook Form

### State Management
- **Use TanStack Query** for all server state (API calls, database queries)
- **Use Zustand** for client-side state management
- **Never use React Context** for state management
- **Never use useState/useReducer** for complex state
- **Create custom hooks** for complex state logic

### Data Fetching
- **Use TanStack Query** for all API calls
- **Never use fetch/axios directly** in components
- **Create API client functions** in `src/lib/api/`
- **Use TypeScript interfaces** for all API response types
- **Handle loading/error states** with TanStack Query

### Database Operations
- **Use Prisma** for all database operations
- **Never write raw SQL** in application code
- **Create database types** in `src/types/database.ts`
- **Use Prisma client** from `@/lib/db`
- **Follow Prisma best practices** for queries and relations

### Styling
- **Use Tailwind CSS classes** exclusively
- **Never use CSS modules or styled-components**
- **Follow the existing color system** defined in globals.css
- **Use responsive utilities** for mobile-first design
- **Never use !important** in CSS

### Icons
- **Use Lucide React icons** exclusively
- **Never use other icon libraries**
- **Import icons directly** from `lucide-react`
- **Use consistent icon sizes** (16px, 20px, 24px)
- **Never use SVG files** directly in components

### Charts and Data Visualization
- **Use Recharts** for all charting needs
- **Never use other chart libraries**
- **Create chart components** in `src/components/charts/`
- **Use responsive containers** for all charts
- **Follow the existing chart styling** with consistent colors

### Animations
- **Use Framer Motion** for all animations
- **Never use CSS animations or transitions**
- **Create animation variants** for reusable motion
- **Use `animate` prop** for simple animations
- **Create custom animation hooks** for complex animations

### Real-time Features
- **Use Socket.IO** for all real-time communication
- **Never use WebSockets directly**
- **Create socket event handlers** in `src/lib/socket.ts`
- **Use socket hooks** for client-side socket management
- **Handle connection states** properly

### Authentication
- **Use NextAuth.js** for all authentication
- **Never implement custom auth**
- **Create auth pages** in `src/app/auth/`
- **Use auth middleware** for protected routes
- **Follow NextAuth.js best practices** for security

### File Organization
- **Follow the existing directory structure**
- **Create components** in `src/components/`
- **Create pages** in `src/app/`
- **Create hooks** in `src/hooks/`
- **Create utilities** in `src/lib/`
- **Create types** in `src/types/`

### Code Quality
- **Always use TypeScript** with strict mode
- **Follow ESLint rules** defined in the project
- **Use Prettier** for code formatting
- **Write JSDoc comments** for complex functions
- **Never ignore TypeScript errors**

### Performance
- **Use React.memo** for expensive components
- **Use useCallback/useMemo** for expensive computations
- **Lazy load components** with `next/dynamic`
- **Optimize images** with Next.js Image component
- **Never use inline functions** in JSX props

### Error Handling
- **Use error boundaries** for component errors
- **Handle API errors** with TanStack Query
- **Show user-friendly error messages**
- **Log errors** for debugging
- **Never expose sensitive error details** to users