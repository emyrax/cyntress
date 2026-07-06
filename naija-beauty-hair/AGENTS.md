# Cyntress Luxury — Agent Guide

## Stack
- **Vite + React 19** — no test/lint/typecheck config
- **Tailwind CSS v4** — uses `@import "tailwindcss"` + `@theme` block in `globals.css`, **no** `tailwind.config.js`
- **Firebase** (Auth, Firestore, Storage) — config from `.env` (`VITE_FIREBASE_*`)
- **react-router-dom v7**, **react-helmet-async**, **Swiper 11**

## Commands
| Command | Use |
|---|---|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |

## Brand
- Colors: `ink` (#1A1A1A), `gold` (#C9A84C), `cream` (#FFF8F0) — use Tailwind classes `bg-ink`, `text-gold`, `border-gold`, etc.
- Font: **Butler** (serif) for headings — `.woff2` files in `public/fonts/`, loaded via `@font-face` in `globals.css`
- Butler class: `font-serif` (aliased in `@layer base` for `h1`-`h6`)

## Architecture
- **Entry**: `src/main.jsx` → `App.jsx` (router + providers)
- **Contexts**: `AuthProvider` wraps `CartProvider` wraps routes in `App.jsx`
- **Public layout**: `AnnouncementBar + Header + main + Footer` wraps all public pages
- **Admin layout**: sidebar nav, gated by `AdminProvider` (checks `admins/{uid}` Firestore doc for `role: admin` or `editor`)
- **Routes** defined in `App.jsx` — public pages at `/`, `/collections/:slug`, `/product/:handle`, `/cart`, `/checkout`, `/blog*`, `/about`, `/how-to-order`, `/login`; admin at `/admin/*`
- **Nav data** in `src/data/navigation.js`: `mainNav`, `footerLinks`, `adminSidebar`

## Firestore Collections
| Collection | Document ID | Used by |
|---|---|---|
| `products` | auto | ProductList/Form, ProductDetail, Collection, Home |
| `categories` | auto | Admin seeding |
| `banners` | auto | BannerList/Form, HeroBanner (not yet wired from Firestore) |
| `blogs` | auto | PostList/Form, Blog, BlogPost |
| `orders` | auto | OrderList, Checkout, Cart, Dashboard |
| `newsletter_subscribers` | auto | Footer newsletter |
| `admins` | UID | AuthContext (admin check) |
| `seo_settings` | `'global'` | SEOSettings page |
| `pages` | slug | PageEditor |
| `carts` | UID | CartContext (synced when logged in) |

## Checkout
- **WhatsApp only** (no Paystack) — `src/utils/whatsappMessage.js` builds order message with product links
- Number: `+2349124449757`
- Both Cart and Checkout pages save order to Firestore (`status: pending`, `paymentMethod: whatsapp`) then open WhatsApp

## Cart
- LocalStorage key: `cyntress_cart`
- Synced to Firestore `carts/{uid}` when user is logged in

## Notable Patterns
- All Firestore CRUD through `src/firebase/firestore.js` (`getDocument`, `getDocuments`, `addDocument`, `updateDocument`, `deleteDocument`)
- Category slugs used as URL path segments (e.g. `/collections/glueless-wigs`)
- Marketing params (UTM/fbclid) captured via `useMarketingParams` hook, stored in sessionStorage
- Currency: NGN, formatter in `src/utils/formatCurrency.js` (en-NG locale, 0 decimal places)
- Product images: first = main, second = hover swap on ProductCard
- SEO: `SEOFields` component with title (60 char) + description (160 char) + preview; global defaults in `SEOSettings` admin page
- Tracking: GA4 + Facebook Pixel via `src/utils/tracking.js`
- `@/` import alias maps to `src/`
- No TypeScript — all `.jsx` / `.js`
- No snapshot, fixture, or integration test infrastructure
