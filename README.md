# Siddhesh — Portfolio & Blog

A modern, premium portfolio and blog built with **Next.js 16**, **Tailwind CSS 4**, and **Supabase**. Features smooth GSAP animations, a full-featured admin dashboard for blog management, and a comment system.

## Tech Stack

- **Framework** — Next.js 16 (App Router, React Compiler)
- **Styling** — Tailwind CSS 4
- **Database** — Supabase (PostgreSQL + Storage)
- **Animations** — GSAP, Framer Motion
- **Typography** — Geist, Playfair Display, Poppins, Caveat
- **Deployment** — Vercel

## Features

- ⚡ Premium hero section with wave animations and rotating roles
- 📝 Full blog system (CRUD via admin panel)
- 💬 Comment system on blog posts
- 👁️ View counter per post
- 🎨 Dark/Light mode with smooth transitions
- 📱 Fully responsive design
- 🔍 SEO optimized with structured data (JSON-LD)
- 🔒 Admin dashboard with auth
- 📤 Image uploads to Supabase Storage

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file with:

```env
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

For production, add these same variables in the **Vercel Dashboard → Settings → Environment Variables**.

## Deployment

This project is deployed on [Vercel](https://vercel.com). Push to `main` to trigger automatic deployments.
