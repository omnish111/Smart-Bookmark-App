# Google Authentication Setup Guide

Follow these steps exactly to make "Continue with Google" work.

## Phase 1: Get Google Credentials (Google Cloud Console)

1.  Go to **[Google Cloud Console](https://console.cloud.google.com/)**.
2.  **Create a New Project**:
    - Click the project dropdown at the top left.
    - Click **"New Project"**.
    - Name it `Smart Bookmark App` and click **Create**.
3.  **Configuring OAuth Consent Screen**:
    - In the search bar at the top, type **"OAuth Consent Screen"** and select it.
    - Select **External** (if asked) and click **Create**.
    - **App Name**: `Smart Bookmark App`.
    - **User Support Email**: Select your email.
    - **Developer Contact Email**: Enter your email.
    - Click **Save and Continue** until you finish (you don't need to add scopes/test users yet).
4.  **Create Credentials**:
    - Click **Credentials** on the left menu.
    - Click **+ CREATE CREDENTIALS** -> **OAuth client ID**.
    - **Application type**: Select **Web application**.
    - **Name**: `Supabase Auth`.
    - **Authorized Redirect URIs** (Crucial Step):
      - Click **ADD URI**.
      - You need your Supabase Project URL. It looks like: `https://<project-ref>.supabase.co/auth/v1/callback`.
      - To find this: Go to Supabase Dashboard -> **Settings > API** -> Copy **URL** and add `/auth/v1/callback` to the end.
      - Paste that full URL into Google Cloud.
    - Click **Create**.
5.  **Copy Your Keys**:
    - Copy the **Client ID**.
    - Copy the **Client Secret**.

## Phase 2: Configure Supabase

1.  Go to your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2.  Click on your project.
3.  Go to **Authentication** (icon on left) -> **Providers**.
4.  Select **Google**.
5.  **Enable Google**: Toggle the switch to "Enabled".
6.  **Paste Credentials**:
    - Paste the **Client ID** from Step 1.
    - Paste the **Client Secret** from Step 1.
7.  Click **Save**.

## Phase 3: Update URL Configuration (Redirects)

1.  In Supabase Dashboard, go to **Authentication** -> **URL Configuration**.
2.  **Site URL**: Set this to `http://localhost:3000`.
3.  **Redirect URLs**:
    - Click **Add URL**.
    - Enter: `http://localhost:3000/auth/callback`.
    - Click **Add**.
4.  Click **Save**.

## Phase 4: Test

1.  Restart your local server (`Ctrl+C` then `npm run dev`).
2.  Go to `http://localhost:3000/login`.
3.  Click "Continue with Google".

It should now work perfectly!
