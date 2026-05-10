# KTD Frontend - Admin CMS with Supabase Authentication

A modern Next.js 16 frontend with integrated Supabase authentication and admin CMS dashboard. Built with TypeScript, Tailwind CSS, and latest Supabase standards (2026).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase project account
- Environment variables configured

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup

```bash
# 1. Wait for Supabase project to be active
# Visit: https://app.supabase.com

# 2. Apply database migrations
supabase db push

# 3. Generate TypeScript types from schema
npx supabase gen types typescript > src/types/database.ts

# 4. Test admin panel
npm run dev
# Navigate to: http://localhost:3000/admin/login
```

---

## 📋 Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase Public Keys (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Secret Key (NEVER commit)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important:**
- `NEXT_PUBLIC_*` variables are exposed to the browser (use publishable key only)
- `SUPABASE_SERVICE_ROLE_KEY` is SECRET - never push to git
- Add `.env.local` to `.gitignore`

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── page.tsx             # Dashboard home
│   │   ├── login/
│   │   │   └── page.tsx         # Admin login form
│   │   ├── pages/
│   │   │   └── page.tsx         # Page management
│   │   ├── content/
│   │   │   └── page.tsx         # Content management
│   │   ├── media/
│   │   │   └── page.tsx         # Media library
│   │   └── settings/
│   │       └── page.tsx         # Site settings
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser client (Supabase)
│       ├── server.ts            # Server client (Supabase)
│       ├── middleware.ts        # Auth middleware
│       └── admin.ts             # Admin helper functions
├── types/
│   └── database.ts              # TypeScript types from schema
└── components/
    ├── landing/                 # Landing page components
    └── ui/                      # Reusable UI components
├── middleware.ts                # Next.js middleware (auth)
├── CHANGELOG.md                 # Track new features
└── migrations/
    └── 001_create_admin_users_table.sql  # DB migration
```

---

## 🔐 Authentication & Admin Access

### Architecture

```
Client (Browser)
    ↓
Sign In with Email/Password
    ↓
Supabase Auth (session stored in cookies)
    ↓
Middleware (validates session)
    ↓
Admin Access Check (checks admin_users table)
    ↓
Admin Dashboard
```

### How It Works

1. **Login Page** (`/admin/login`)
   - Email/password form
   - Uses Supabase `signInWithPassword()`
   - Session stored in secure cookies

2. **Middleware** (`middleware.ts`)
   - Intercepts all requests
   - Uses latest Supabase `getSession()` (not deprecated `getClaims()`)
   - Validates session on `/admin/*` routes
   - Redirects to login if no session

3. **Admin Check** (`src/lib/supabase/admin.ts`)
   - `checkAdminAccess()` verifies user in `admin_users` table
   - Checks `is_admin` flag or `role` field
   - Uses RLS policies for security

4. **Layout** (`src/app/admin/layout.tsx`)
   - Server component with auth check
   - Shows sidebar navigation
   - User profile dropdown with logout

### Latest Standards (2026)

**✅ Using:**
```typescript
// Correct way (current standard)
const { data: { session } } = await supabase.auth.getSession()
const user = session?.user
```

**❌ NOT Using:**
```typescript
// Deprecated (old way)
const { data } = await supabase.auth.getClaims()
const user = data?.claims
```

---

## 📊 Database Schema

### admin_users Table

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'editor', -- 'admin', 'moderator', 'editor'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

### RLS Policies

- ✅ Admins can view/update all admin users
- ✅ Users can view their own profile
- ✅ Users cannot change their own admin status
- ✅ Row-level security prevents unauthorized access

---

## 🛠️ Development

### Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format
```

### TypeScript Setup

The project uses TypeScript with strict mode enabled. Generate updated types:

```bash
# Generate types from Supabase schema
npx supabase gen types typescript > src/types/database.ts
```

**Type Usage Example:**
```typescript
import type { AdminUser } from '@/types/database'

const user: AdminUser = {
  id: '123',
  email: 'admin@example.com',
  is_admin: true,
  role: 'admin',
  // ...
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Visit `/admin/login` without authentication → Should see login form
- [ ] Enter invalid credentials → Should show error
- [ ] Enter valid credentials → Should redirect to `/admin`
- [ ] Try accessing `/admin` directly without login → Should redirect to login
- [ ] Click logout → Should redirect to login
- [ ] Session persists after page refresh → Should stay logged in
- [ ] Check middleware protects all `/admin/*` routes

### Testing with Supabase

1. Create test user in Supabase dashboard
2. Add user to `admin_users` table with `is_admin = true`
3. Login with test credentials
4. Verify access to admin dashboard

---

## 📚 Key Files & Their Purposes

| File | Purpose |
|------|---------|
| `middleware.ts` | Request interceptor for auth validation (latest standards) |
| `src/lib/supabase/client.ts` | Browser-side Supabase client |
| `src/lib/supabase/server.ts` | Server-side Supabase client |
| `src/lib/supabase/admin.ts` | Admin helper functions |
| `src/types/database.ts` | TypeScript types for database schema |
| `migrations/001_create_admin_users_table.sql` | Database migration with RLS |
| `CHANGELOG.md` | Track new features & changes |

---

## 🔗 Dependencies

```json
{
  "@supabase/ssr": "^0.9.0",           // Latest SSR support
  "@supabase/supabase-js": "^2.99.3",  // Latest client library
  "@tanstack/react-query": "^5.95.0",  // Data fetching
  "next": "16.2.1",                    // Latest Next.js
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "tailwindcss": "^3.x"               // Styling
}
```

---

## 🚨 Troubleshooting

### Issue: "Connection timeout" in database queries

**Solution:** Project may be inactive. Check Supabase dashboard:
```
https://app.supabase.com/projects
```
Wait for project to come online, then retry.

### Issue: RLS policy blocking queries

**Solution:** Verify:
1. User exists in `admin_users` table
2. `is_admin` or `role` is set correctly
3. RLS policy allows the operation

### Issue: Session lost after deploy

**Solution:** Ensure middleware is properly updating cookies:
```typescript
cookiesToSet.forEach(({ name, value, options }) =>
  supabaseResponse.cookies.set(name, value, {
    ...options,
    secure: true,
    httpOnly: true,
  })
)
```

### Issue: Types not updating

**Solution:** Regenerate types after schema changes:
```bash
npx supabase gen types typescript > src/types/database.ts
```

---

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 📝 License

MIT

---

## 🤝 Contributing

See `CHANGELOG.md` for recent changes and new features.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
