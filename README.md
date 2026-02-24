This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy the CMS to Vercel

Follow these steps to deploy the CMS portion of this app to Vercel.

- Connect the Git repository to Vercel (Import Project → Git Provider → select repo).
- In the Vercel project settings, add the required Environment Variables (both Preview and Production as appropriate). Example keys are listed in `.env.example`:
	- `DATABASE_URL` (production Postgres connection string)
	- `DATABASE_URL_UNPOOLED` (optional unpooled URL if used by Prisma)
	- `NEXTAUTH_SECRET`
	- `NEXTAUTH_URL` (set to your production URL)
	- `RESEND_API_KEY`, `EMAIL_FROM` (if using Resend for emails)
	- `MVC_TCB_KEY`, `MVC_TCB_SECRET` (optional legacy keys)

- Build command (already configured):

```bash
prisma generate && next build
```

- After pointing Vercel at the repo and configuring vars, you must run Prisma migrations against your production database. Do this from a machine with access to the production DB (not on Vercel). Example:

```bash
# generate client locally (if needed)
npx prisma generate
# run migrations against the production DB
npx prisma migrate deploy --schema=prisma/schema.prisma
```

- Optionally open Prisma Studio to inspect data (locally against the same DB):

```bash
npm run prisma:studio
```

- Once envs and migrations are in place, trigger a deployment on Vercel. The CMS UI will be available at:

```
https://<your-vercel-project>.vercel.app/cms
```

If you want, I can: connect the repo to Vercel (if you give me access), create a `vercel` Git integration guide, or prepare a small GitHub Actions workflow to run migrations automatically when you merge to `main`.
