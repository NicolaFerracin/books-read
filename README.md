# Books

A personal reading tracker. Track books, reading progress, ratings, and stats.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS 4
- Firebase (Auth + Firestore + Hosting)
- Open Library API (cover images & book search)

## Setup

```bash
npm install
cp .env.example .env  # fill in your Firebase config
npm run dev
```

## Environment variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Deploy

```bash
npm run build
firebase deploy
```

## Legacy

The previous version (React 16, CRA, SCSS) is preserved in the `legacy-v1` branch.
