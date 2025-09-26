# Database Setup for Vercel Deployment

This project uses PostgreSQL with Prisma ORM. Here's how to set up the database for Vercel deployment:

## Database Options for Vercel

### 1. Vercel Postgres (Recommended)
- Go to your Vercel dashboard
- Navigate to your project
- Go to Storage tab
- Create a new Postgres database
- Copy the connection string to your environment variables

### 2. Neon (Free Tier Available)
- Sign up at [neon.tech](https://neon.tech)
- Create a new project
- Copy the connection string
- Add to Vercel environment variables

### 3. Supabase (Free Tier Available)
- Sign up at [supabase.com](https://supabase.com)
- Create a new project
- Go to Settings > Database
- Copy the connection string
- Add to Vercel environment variables

### 4. Railway
- Sign up at [railway.app](https://railway.app)
- Create a new PostgreSQL service
- Copy the connection string
- Add to Vercel environment variables

## Environment Variables

Add the following environment variable to your Vercel project:

```
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
```

## Database Migration

After setting up your database, run the migration:

```bash
npm run db:migrate:deploy
```

Or if you're using Vercel CLI:

```bash
vercel env pull
npx prisma migrate deploy
```

## Local Development

For local development, you can use:

1. **Docker PostgreSQL**:
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=group_holiday_dates -p 5432:5432 -d postgres
   ```

2. **Local PostgreSQL installation**

3. **Use a cloud database** (same as production)

## Useful Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run migrations in development
- `npm run db:migrate:deploy` - Run migrations in production
- `npm run db:push` - Push schema changes without migrations
- `npm run db:studio` - Open Prisma Studio
