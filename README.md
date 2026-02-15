# Smart Bookmark App

This is a modern bookmark manager built with **Next.js (App Router)** and **Supabase**. It features Google Authentication, real-time updates, and a minimal, responsive UI.

## 🚀 Features

- **Google Authentication**: Secure login via Supabase Auth.
- **Private Bookmarks**: Row Level Security ensures users only see their own data.
- **Real-time Updates**: Changes reflect instantly across tabs/devices.
- **Responsive UI**: Optimized for mobile, tablet, and desktop.
- **Instant UI**: Optimistic updates make the app feel snappy.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel

## 挑战 Challenges & Solutions

### 1. Google Authentication Setup (The Hardest Part)

**Problem**: Configuring Google OAuth involves strict matching of Redirect URIs across Google Cloud, Supabase, and the App. We faced recurring `redirect_uri_mismatch` errors.
**Solution**: Carefully aligned all URLs to be exactly `http://localhost:3000` (no https locally) and ensured the callback path `/auth/callback` was whitelisted in both Google and Supabase dashboards. We created a dedicated `SETUP_GOOGLE_AUTH.md` document to streamline this process.

### 2. Immediate UI Feedback

**Problem**: Initially, adding a bookmark required waiting for the database response or a page refresh to appear in the list.
**Solution**: We implemented **Optimistic Updates** by lifting the state to the parent component. When a user adds a bookmark, it's instantly added to the local state for immediate feedback, while the backend request processes in the background.

### 3. Realtime Consistency

**Problem**: Ensuring multiple tabs stay in sync without duplicating data when optimistic updates are also used.
**Solution**: We combined Supabase Realtime subscriptions with a check for duplicates. If a bookmark arrives via Realtime that we already added optimistically (by matching ID), we ignore it to prevent flickering or duplication.

## 📦 Getting Started

1.  Clone the repo.
2.  Install dependencies: `npm install`.
3.  Set up Supabase (run `supabase_schema.sql`).
4.  Configure `.env.local` with your Supabase keys.
5.  Run locally: `npm run dev`.

See `DEPLOYMENT.md` and `SETUP_GOOGLE_AUTH.md` for full details.
