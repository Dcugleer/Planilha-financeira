# AI Rules for Financial Control App

## Tech Stack Overview

- **Next.js 15** - React framework with App Router for server-side rendering and static site generation
- **TypeScript** - Type-safe JavaScript development with full IntelliSense and compile-time error checking
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development with responsive design
- **shadcn/ui** - Modern, accessible component library built on Radix UI primitives
- **React Hook Form + Zod** - Performant form handling with schema validation
- **Zustand** - Lightweight state management for global application state
- **TanStack Query** - Server state management with caching, retries, and background updates
- **Prisma** - Type-safe database ORM with auto-generated migrations
- **NextAuth.js** - Complete authentication solution for Next.js applications
- **Framer Motion** - Production-ready motion library for smooth animations

## Library Usage Rules

### UI Components
- **Always use shadcn/ui components** for all UI elements (buttons, cards, dialogs, etc.)
- **Never create custom UI components** when shadcn/ui equivalents exist
- **Import components directly** from `@/components/ui/` (e.g., `import { Button } from '@/components/ui/button'`)
- **Use Tailwind CSS classes** for custom styling when extending shadcn/ui components
- **Follow the existing design system** - use consistent colors, spacing, and typography

### Forms and Validation
- **Use React Hook Form** for all form handling (`useForm`, `Controller`, etc.)
- **Use Zod schemas** for form validation (`z.object()`, `z.string()`, etc.)
- **Combine with `@hookform/resolvers`** to integrate Zod with React Hook Form
- **Never use controlled inputs** directly - always use `Controller` components
- **Use `FieldValues`** for form types when possible

### State Management
- **Use Zustand** for global application state (user preferences, settings, etc.)
- **Use React state** for local component state (form inputs, UI toggles, etc.)
- **Use TanStack Query** for server state and data fetching
- **Never use Redux** - Zustand is preferred for simplicity
- **Use `create`** for Zustand stores and `use` for hooks

### Data Fetching
- **Use TanStack Query** (`useQuery`, `useMutation`, etc.) for all API calls
- **Never use `useEffect` + `fetch`** directly for data fetching
- **Use Axios** for HTTP client when making raw API calls
- **Structure queries with proper keys** for caching and invalidation
- **Handle loading and error states** using TanStack Query's built-in states

### Styling
- **Use Tailwind CSS classes** exclusively for styling
- **Never write custom CSS** unless absolutely necessary
- **Use `@apply` directives** only in specific utility cases
- **Follow the existing color system** defined in `globals.css`
- **Use responsive prefixes** (`sm:`, `md:`, `lg:`, `xl:`) for responsive design

### Database
- **Use Prisma** for all database operations
- **Never write raw SQL** - use Prisma's type-safe queries
- **Use `@prisma/client`** for database client access
- **Follow the existing schema** in `prisma/schema.prisma`
- **Use `findUnique`, `findMany`, `create`, `update`, `delete`** methods

### Authentication
- **Use NextAuth.js** for all authentication needs
- **Never implement custom auth** - use NextAuth.js providers
- **Use `useSession`** for session management
- **Use `getSession`** for server-side session access
- **Follow the existing auth configuration**

### Icons
- **Use Lucide React** icons exclusively (`import { IconName } from 'lucide-react'`)
- **Never use other icon libraries** unless specifically required
- **Use consistent icon sizes** (16px, 20px, 24px, 32px)
- **Choose meaningful icons** that represent the action or concept

### Charts and Data Visualization
- **Use Recharts** for all charting needs
- **Never use other chart libraries** unless specifically required
- **Use `ResponsiveContainer`** for responsive charts
- **Follow the existing chart styling** and color schemes
- **Include proper tooltips and legends** for accessibility

### Animations
- **Use Framer Motion** for all animations (`motion`, `AnimatePresence`, etc.)
- **Never use CSS animations** for complex interactions
- **Use `whileHover`, `whileTap`** for interactive elements
- **Use `layout` prop** for smooth transitions when elements change
- **Keep animations subtle and purposeful**

### Date and Time
- **Use `date-fns`** for all date manipulation (`format`, `addDays`, etc.)
- **Never use `Date` object methods** directly
- **Format dates consistently** using the existing date formatting functions
- **Use relative time** where appropriate (e.g., "2 days ago")

### File Structure
- **Follow the existing directory structure**:
  - `src/app/` - Next.js app router pages and layouts
  - `src/components/` - Reusable components
  - `src/components/ui/` - shadcn/ui components
  - `src/hooks/` - Custom React hooks
  - `src/lib/` - Utility functions and configurations
  - `src/types/` - TypeScript type definitions
- **Use kebab-case for file names** (e.g., `user-profile.tsx`)
- **Use PascalCase for component names** (e.g., `UserProfile.tsx`)
- **Group related files** in logical subdirectories

### TypeScript
- **Always use TypeScript** - no `.js` or `.jsx` files
- **Define proper interfaces** for all data structures
- **Use `interface` over `type`** for object types
- **Use `type`** for unions and primitives
- **Enable strict mode** in TypeScript configuration

### Testing
- **Use Jest** for unit tests when needed
- **Use React Testing Library** for component tests
- **Write tests for critical functionality** only
- **Follow the existing test structure** and naming conventions

### Performance
- **Use React.memo** for expensive components
- **Use `useCallback` and `useMemo`** for expensive computations
- **Implement proper loading states** with TanStack Query
- **Optimize bundle size** by code splitting large components
- **Use Next.js dynamic imports** for non-critical components

### Code Quality
- **Follow ESLint rules** defined in the project
- **Use Prettier** for consistent code formatting
- **Write meaningful commit messages** following conventional commits
- **Keep functions small and focused** (single responsibility)
- **Use JSDoc comments** for complex functions and types

### Security
- **Never expose sensitive data** in client-side code
- **Use environment variables** for secrets and API keys
- **Validate all user input** on both client and server
- **Use HTTPS** for all API calls
- **Implement proper CORS policies** for API endpoints

### Development Workflow
- **Use the existing scripts** in `package.json` (`npm run dev`, `npm run build`, etc.)
- **Follow the existing linting and formatting** rules
- **Use TypeScript compiler** for type checking
- **Test thoroughly** before committing changes
- **Keep dependencies updated** but avoid breaking changes