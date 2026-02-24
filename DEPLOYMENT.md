# Deployment Guide: GitHub → Vercel + PostgreSQL

## Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account
- PostgreSQL database (see options below)

---

## 1. Push to GitHub

From your project root, run:

```bash
# Initialize git (if not already done)
git init
git branch -m main

# Stage and commit
git add .
git commit -m "Initial commit: Sleep Diagnosis CMS"

# Create repo on GitHub (via https://github.com/new) then:
git remote add origin https://github.com/YOUR_USERNAME/sleep-diagnosis-claude.git
git push -u origin main
```

**Or** install [GitHub CLI](https://cli.github.com/) and run:

```bash
gh repo create sleep-diagnosis-claude --private --source=. --push
```

---

## 2. Add PostgreSQL on Vercel Dashboard and Configure the DB

### Option A: Vercel Postgres (recommended — creates DB and sets env vars for you)

1. Open [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project (e.g. **sleep-diagnosis-claude**).
3. Go to the **Storage** tab.
4. Click **Create Database** → choose **Postgres** (powered by Neon).
5. Name it (e.g. `sleep-diagnosis-db`), pick a region, click **Create**.
6. When prompted **Connect to Project**, select this project and confirm.  
   Vercel will automatically add `DATABASE_URL`, `POSTGRES_URL`, and `POSTGRES_PRISMA_URL` to your project.
7. **Redeploy** the project (Deployments → ⋮ on latest → Redeploy) so the build uses the new env vars.
8. Run migrations once (see [Run migrations on production](#4-run-migrations-on-production) below).

Your app uses `DATABASE_URL` (see [prisma/schema.prisma](prisma/schema.prisma)); no code changes needed.

### Option B: Use an existing Postgres (Neon, Supabase, etc.)

1. In Vercel Dashboard → your project → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** your full connection string, e.g.  
     `postgresql://USER:PASSWORD@HOST:5432/sleep_diagnosis?schema=public`  
     (for Neon/Supabase you may need `?sslmode=require` at the end.)
   - **Environments:** Production, Preview, Development (as needed).
3. Save and **Redeploy** the project.
4. Run migrations once (see below).

---

## 2b. Other ways to provision PostgreSQL (DATABASE_URL)

### Neon (free tier)

1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string (e.g. `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)
3. Use it as `DATABASE_URL` in Vercel env vars

### Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Settings → Database → Connection string (URI)
3. Use it as `DATABASE_URL` in Vercel env vars

---

## 3. Deploy to Vercel

### Via GitHub (recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo `sleep-diagnosis-claude`
3. Add environment variables:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `NEXTAUTH_SECRET` = run `openssl rand -base64 32` to generate
   - `NEXTAUTH_URL` = `https://your-app.vercel.app` (Vercel will suggest this)
4. Deploy

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
# Follow prompts, add env vars when asked
```

---

## 4. Run Migrations on Production

After first deploy, run migrations against your production DB:

```bash
# Set DATABASE_URL to your production connection string, then:
npx prisma migrate deploy
```

For seeding (optional, dev data):

```bash
npm run prisma:seed
```

---

## 5. Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Random secret for NextAuth |
| `NEXTAUTH_URL` | Yes | Your app URL (e.g. `https://xxx.vercel.app`) |
| `EMAIL_*` | Optional | SMTP for email features |
| `MVC_TCB_*` | Optional | Tencent CloudBase (legacy) |

---

## CMS Access

After deployment, the CMS is at: **https://your-app.vercel.app/cms**
