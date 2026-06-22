# Job Application Tracker

A full-stack web application to track and manage job applications throughout the hiring process. Built with Next.js 16, React 19, and PostgreSQL.

## Features

- **Dashboard** — Overview with stats and charts showing application progress
- **Application Management** — Add, edit, and delete job applications
- **Kanban Board** — Drag-and-drop board to visually manage application stages
- **Table View** — Sortable, filterable table for quick scanning
- **Status Tracking** — Track applications through: Applied → Phone Screen → Interviewing → Offer / Rejected / Withdrawn
- **Notes** — Add notes to each application for interview prep and follow-ups
- **Authentication** — Secure sign-in with NextAuth.js
- **Dark Mode** — Full dark mode support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Frontend | React 19, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon Serverless) |
| ORM | Prisma 7 |
| Auth | NextAuth.js v5 |
| Charts | Recharts |
| Drag & Drop | dnd-kit |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A PostgreSQL database (e.g., [Neon](https://neon.tech))

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/PantelisTsagkas/job-application-tracker.git
   cd job-application-tracker
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Create a GitHub OAuth App**

   Register one at [github.com/settings/applications/new](https://github.com/settings/applications/new) with:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

   Note the Client ID and generate a Client Secret — GitHub OAuth Apps only support one callback URL, so use a separate app for local dev vs. production.

4. **Set up environment variables**

   Create a `.env.local` file:

   ```env
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="..."   # generate with: openssl rand -base64 32

   GITHUB_ID="..."
   GITHUB_SECRET="..."
   ```

5. **Push the schema to your database**

   ```bash
   npx prisma db push
   ```

6. **Run the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login page
│   ├── (dashboard)/     # Main app pages
│   └── api/             # API routes
├── components/
│   ├── applications/    # App-specific components
│   ├── dashboard/       # Dashboard widgets
│   ├── layout/          # Header, Sidebar
│   └── ui/              # shadcn/ui primitives
├── lib/                 # Prisma client, auth config, utils
└── types/               # TypeScript types
```

## License

MIT
