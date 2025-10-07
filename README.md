# Progressive Web App Template

PWA designed as a bootstrap for creating apps.  
The app helps manage training schedules, sign-ups, and attendance, with support for both Hebrew and English.

## Features

- PWA: preconfigured manifest, service worker (`public/sw.js`), auto registration, install prompt hook
- Auth & Roles: Firebase Auth, admin roles, route guards (`RequireAuth`, `RequireAdmin`)
- Firestore: ready-to-use client utilities and examples
- Push Notifications (FCM): token management, foreground handler, SW (`public/firebase-messaging-sw.js`)
- i18n: English/Hebrew, language provider and gate, sample translations
- API Routes: notifications, user preferred language, scheduled jobs (`/api/cron/daily`, `/api/cron/monthly`)
- Vercel Cron: schedules in `vercel.json` with optional `CRON_SECRET` protection
- Ready Pages: auth (`/(auth)/login`, `/(auth)/register`), `account`, `admin`, `schedule`, home
- Tooling: Next.js App Router + TypeScript, ESLint, PWA registration component

## Tech Stack

- [Next.js](https://nextjs.org/) – React framework with PWA support  
- [Vercel](https://vercel.com/) – hosting and deployment  
- [Firebase](https://firebase.google.com/) – authentication & Firestore database  

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
npm run dev
