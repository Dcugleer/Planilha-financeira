# AI Rules for Financial Control App

## Tech Stack

- **Next.js 15** - React framework with App Router for server-side rendering and static site generation
- **TypeScript 5** - Static type checking for JavaScript code
- **Tailwind CSS 4** - Utility-first CSS framework for styling
- **Prisma** - Modern database ORM for type-safe database access
- **NextAuth.js** - Complete authentication solution for Next.js applications
- **shadcn/ui** - Collection of reusable components built on Radix UI
- **Lucide React** - Beautiful & consistent icon library
- **Framer Motion** - Production-ready motion library for React
- **TanStack Query** - Server state management for React
- **Zustand** - Lightweight state management solution
- **React Hook Form** - Performant, flexible, and extensible forms library
- **Zod** - TypeScript-first schema validation
- **Recharts** - Composable charting library built on React and D3
- **DND Kit** - Modern drag and drop toolkit for React
- **Socket.IO** - Real-time bidirectional event-based communication

## Library Usage Rules

### UI Components
- **Always use shadcn/ui components** for all UI elements
- **Never create custom UI components** unless absolutely necessary
- **Import components directly** from `@/components/ui/`
- **Use Tailwind CSS classes** for all styling, never inline styles
- **Follow the existing design system** - use consistent colors, spacing, and typography

### Forms & Validation
- **Use React Hook Form** for all form handling
- **Use Zod** for all form validation schemas
- **Create form schemas** in `src/lib/validations.ts`
- **Use `useForm` hook** with resolver set to zodResolver
- **Always include proper error handling** and user feedback

### State Management
- **Use Zustand** for global application state
- **Use TanStack Query** for server state and data fetching**
- **Use React hooks** for local component state
- **Never use Redux** - it's not in the tech stack
- **Keep state as close to the component as possible**

### Data & Database
- **Use Prisma** for all database operations
- **Create database models** in `prisma/schema.prisma`
- **Use Prisma Client** from `@/lib/db.ts`
- **Never use raw SQL** - always use Prisma's type-safe queries
- **Follow the existing database patterns** and naming conventions

### Authentication
- **Use NextAuth.js** for all authentication needs
- **Create authentication pages** in `src/app/auth/`
- **Use NextAuth providers** for social login (Google, GitHub, etc.)
- **Never implement custom authentication** - use NextAuth.js
- **Follow the existing auth patterns** and session management

### Styling
- **Use Tailwind CSS classes** exclusively
- **Never use CSS modules or global CSS files**
- **Use the design tokens** defined in `src/app/globals.css`
- **Follow the color system** - use the predefined color classes
- **Make everything responsive** - use responsive Tailwind classes

### Charts & Data Visualization
- **Use Recharts** for all charting needs
- **Create chart components** in `src/components/charts/`
- **Use responsive containers** for all charts
- **Follow the existing chart patterns** and styling
- **Never use D3 directly** - use Recharts instead

### Real-time Features
- **Use Socket.IO** for real-time communication
- **Create socket handlers** in `src/lib/socket.ts`
- **Use the existing socket setup** from `server.ts`
- **Never use WebSockets directly** - use Socket.IO
- **Follow the existing socket patterns** and event handling

### Icons
- **Use Lucide React icons** exclusively
- **Import icons directly** from `lucide-react`
- **Never use other icon libraries** or SVG files
- **Follow the existing icon patterns** and sizing
- **Use consistent icon styles** throughout the app

### File Organization
- **Keep components in `src/components/`**
- **Keep pages in `src/app/`**
- **Keep utilities in `src/lib/`**
- **Keep types in `src/types/`**
- **Follow the existing file structure** and naming conventions

### Code Quality
- **Always use TypeScript** - no JavaScript files
- **Follow ESLint rules** - no linting errors allowed
- **Use proper error handling** - never let errors bubble up silently
- **Write clean, readable code** - use meaningful variable names
- **Add proper JSDoc comments** for complex functions

### Performance
- **Use React.memo** for expensive components
- **Use useCallback and useMemo** for optimization
- **Lazy load components** when possible
- **Optimize images** with Next.js Image component
- **Follow the existing performance patterns** and best practices

### Testing
- **Use Jest and React Testing Library** for testing
- **Write tests for critical components** and utilities
- **Follow the existing testing patterns** and conventions
- **Maintain test coverage** - aim for 80%+ coverage
- **Never skip tests** - always run tests before committing

### Security
- **Never expose sensitive data** in client-side code
- **Use environment variables** for secrets and API keys
- **Follow the existing security patterns** and best practices
- **Never use `eval()` or `innerHTML`** - they're security risks
- **Validate all user input** - never trust user data

### Dependencies
- **Never install new packages** without approval
- **Check if a package already exists** before installing
- **Use the existing package versions** - don't upgrade without testing
- **Follow the existing dependency patterns** and conventions
- **Never use deprecated packages** - always use the latest stable versions

### Development Workflow
- **Use the existing scripts** from `package.json`
- **Follow the existing development patterns** and conventions
- **Use the existing build process** - don't modify it
- **Follow the existing deployment patterns** and conventions
- **Never modify the core framework files** - only modify application code