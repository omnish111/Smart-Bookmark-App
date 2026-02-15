# Smart Bookmark App - Deployment Guide

This guide details how to deploy your Smart Bookmark App to production using Supabase and Vercel.

## 1. Supabase Setup

1.  **Create a Project**: Go to [Supabase](https://supabase.com) and create a new project.
2.  **Run SQL Setup**:
    - Go to the **SQL Editor** in your Supabase dashboard.
    - Copy the content of `supabase_schema.sql` from this repository.
    - Paste it into the editor and click **Run**. This will create the `bookmarks` table and apply Row Level Security policies.
3.  **Configure Authentication**:
    - Go to **Authentication > Providers**.
    - Enable **Google**.
    - You will need to set up a Google Cloud Project to get the `Client ID` and `Client Secret`.
    - Add `https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback` to the **Authorized redirect URIs** in your Google Cloud Console.
    - Save the credentials in Supabase.
4.  **Get API Keys**:
    - Go to **Settings > API**.
    - Copy the `Project URL` and `anon public` key.

## 2. Environment Variables

Create a `.env.local` file in your project root for local development, and add these variables to Vercel for production:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Production Deployment (Vercel)

1.  **Push to Git**: Ensure your code is pushed to a Git repository (GitHub, GitLab, etc.).
2.  **Import to Vercel**:
    - Go to [Vercel](https://vercel.com) and click **Add New > Project**.
    - Import your Git repository.
3.  **Configure Project**:
    - Framework Preset: **Next.js** (default).
    - Root Directory: `./` (default).
4.  **Add Environment Variables**:
    - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your Supabase values.
5.  **Deploy**: Click **Deploy**.

## 5. Final Checklist

- [ ] **Authentication**: Verify logging in with Google works and redirects to `/dashboard`.
- [ ] **Database**: Verify you can add a bookmark and it appears in the list.
- [ ] **Realtime**: Open the app in two different browser windows/tabs with the SAME user. adding a bookmark in one should strictly appear in the other without refresh.
- [ ] **Security**: Verify RLS by checking that you cannot access data if you are logged out (or try to access another user's data via API if possible to test).
- [ ] **Design**: Ensure the UI looks clean and responsive on mobile.

## Troubleshooting

- **Redirect Loop**: Ensure your middleware logic correctly allows `/login` and `/auth/callback`.
- **Realtime not working**: Ensure "Realtime" is enabled for the `bookmarks` table in Supabase (Replication settings). The SQL script enables it, but verify in Dashboard > Database > Replication.
- **Images not loading**: If user avatars break, add the domain to `next.config.ts`. We have added `lh3.googleusercontent.com` by default.
