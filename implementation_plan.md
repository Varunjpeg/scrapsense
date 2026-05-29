# ScrapSense: Smart AI-Powered E-Waste Marketplace

ScrapSense is a modern, premium full-stack AI-powered e-waste marketplace web application built using Next.js, Tailwind CSS, TypeScript, and Framer Motion. It adopts a high-end "dark eco-tech" aesthetic (deep obsidian backdrops, vibrant neon emerald highlights, smooth glassmorphism, and Apple/CRED-like micro-animations) to feel like "India's smartest AI-powered e-waste ecosystem."

The system features two main portals: a **User Portal** (for looking up dealers, automated valuation, and getting rewards) and a **Recycler/Refurbisher Portal** (for managing items, orders, analytics, and business profiles).

## User Review Required

We want to align on the technical configuration before bootstrapping the codebase.

> [!IMPORTANT]
> **Next.js & Routing Choice**
> We plan to use Next.js 14+ with **App Router (`/app`)** as it represents the modern framework standard. This allows clean co-location of client dashboards, nested layout portals, and full-stack Node.js API routes (`/api/...`).
>
> **Styling & UI Library**
> We will use **Tailwind CSS** coupled with **lucide-react** for icons, **framer-motion** for premium animations, and a customized responsive design system. The default theme will be a dark-mode-first premium eco-tech design (obsidian gradients, neon green `#10B981` / `#34D399` borders, and high-fidelity blurred backdrops).
>
> **Database & Architecture**
> To ensure the application is immediately testable and functional out-of-the-box without requiring complex database keys, we will create a full local mock-database state provider (backed by `localStorage` and client state sync) that coordinates User accounts, Recycler registration, pending pickup orders, rewards, and device histories. We will also write clean, standard Node.js server routes under `app/api/...` that are *database-ready*, showing you exactly where to connect your MongoDB or Supabase client!

---

## Proposed System Architecture & Folder Structure

We will initialize a Next.js App Router project in the current directory `.` with the following directory structure:

```
├── app/
│   ├── layout.tsx                  # Global HTML wrapper, Google Fonts, theme providers
│   ├── page.tsx                    # Landing page / Hero / High-impact stats
│   ├── globals.css                 # Custom CSS, glassmorphism utilities, scrollbars
│   │
│   ├── auth/                       # Common Authentication flows
│   │   ├── login/page.tsx          # Dual user/business login screen
│   │   └── signup/page.tsx         # Sign up with animated eco-themes
│   │
│   ├── user/                       # USER PORTAL (Protected pages)
│   │   ├── layout.tsx              # Sidebar, wallet tracker, & responsive navigation
│   │   ├── dashboard/page.tsx      # Main User Home (Dealers, Refurbishers, Valuation cards)
│   │   ├── dealers/page.tsx        # Search scrap dealers with interactive map & filtering
│   │   ├── refurbishers/page.tsx   # Search nearby refurbishers & specialized services
│   │   ├── valuation/page.tsx      # AI valuation center (Manual or Camera capture)
│   │   └── profile/page.tsx        # Profile page, Reward Leaderboards, Badges, History
│   │
│   ├── recycler/                   # RECYCLER PORTAL (Protected business pages)
│   │   ├── layout.tsx              # Business dashboard shell with sidebars
│   │   ├── dashboard/page.tsx      # Analytics dashboard, revenue charts, collection heatmaps
│   │   ├── collected/page.tsx      # List of collected items, purchase values, states
│   │   ├── orders/page.tsx         # Pickup request manager (Accept/Reject, live tracking)
│   │   └── profile/page.tsx        # Business settings, certification uploads, ratings
│   │
│   └── api/                        # Backend Node.js API Routes (Ready to hook database)
│       ├── auth/route.ts           # Mock Session controller
│       ├── ai/valuation/route.ts   # Device valuation algorithm & category classifier
│       ├── ai/analyze-image/route.ts# Mock Vision API for device image parsing
│       └── transactions/route.ts   # Pickup booking & recycler transaction logs
│
├── components/                     # Reusable design components
│   ├── MapPreview.tsx              # Leaflet or mock SVG visual interactive location map
│   ├── ChatSupport.tsx             # Interactive floating AI assistant drawer
│   ├── StatsCounter.tsx            # Animated statistic ticker
│   ├── Marquee.tsx                 # Moving tape displaying raw e-waste recycling metrics
│   ├── DeviceValuationForm.tsx     # Wizard-based manual step-by-step device valuation
│   ├── DeviceCameraUpload.tsx      # Camera stream capture & photo analyzer overlay
│   └── ui/                         # Base elements (glass cards, shiny buttons, input fields)
│
├── context/
│   ├── AppContext.tsx              # Central state engine for mock db (syncs user session, orders, items)
│   └── ThemeContext.tsx            # Light/Dark switching core
```

---

## Detailed Feature Implementation Plan

### 1. Visual & Interactive Aesthetics (Apple / CRED styled)
* **Glassmorphism:** Use bespoke Tailwind background utilities (`bg-opacity-10 backdrop-blur-md`) layered with fine gradients (`border border-white/10`) to build high-end glowing panels.
* **Eco-Tech Color Palette:** 
  * Backgrounds: Deep space gray (`#0B0F19`) and obsidian (`#05070C`).
  * Accent Colors: Emerald neon green (`#10B981`, `#059669`) and Cyan eco-glow (`#06B6D4`).
* **Framer Motion Elements:** Hover cards that scale and glow, layout transitions between route segments, and progressive multiselect button groups for questionnaire wizards.

### 2. High-Impact Landing Page
* **Hero Banner:** Compelling slogan: *"India's smartest AI-powered e-waste ecosystem."* Coupled with active calls-to-action ("Sell E-Waste Now" and "Recycler Portal").
* **Moving Marquee:** Infinite horizontal scrolling banner listing metals recovered: `COBALT: 89% recovered`, `GOLD: 2g per ton`, `COPPER: 120kg saved today`, `LITHIUM-ION: 4,200 batteries recycled`.
* **Live Stats Counters:** Animated counting of e-waste diverted from landfills, payout amounts distributed, and carbon offsets gained.

### 3. AI Device Valuation System ("Get Exact Amount For Your Device")
* **Category Detection:** An API endpoint `/api/ai/valuation` that takes a text query (e.g. "iPad Air 4") and classifies it into `Smartphone`, `Tablet`, `Laptop`, or `Smartwatch`, and generates diagnostic options dynamically.
* **Wizard Questions:** Attractive grid selectors for age, screen scratch depth, battery wear (health percentage), operational status (powers on, screen functional), and standard accessory checklist.
* **Camera Vision (Upload/Capture):** 
  * Beautiful visual canvas mock scanning overlay.
  * Capturing an image triggers `/api/ai/analyze-image` which uses computer vision heuristics to detect the phone model and lists exact *Urban Mining Recovery Estimates* (e.g., predicted gold, silver, copper, and plastic weight yields).
* **Valuation Report Screen:** Large glass panel showcasing:
  * **Scrap Value vs. Refurbished Market Value**.
  * Dynamic recommendation: **"Highly Refurbishable!"** (green glowing pill) or **"Best For Direct Material Recovery"** (yellow metallic pill).
  * Direct action buttons to lock the price and schedule a collection with the nearest dealer.

### 4. Interactive Scrap Dealer & Refurbisher Search
* **Location Entry:** Text-based search syncing to high-fidelity Leaflet map coordinates or beautiful interactive visual maps.
* **Dealers & Refurbishers Lists:** Sortable list elements by ratings, distance (e.g., "1.4 km away"), and speed of collection.
* **Action Shortcuts:** Interactive "Call" links, instant WhatsApp webhook launchers, and responsive routes to schedule pickups.

### 5. Dual-Portal Interactive Dashboards
* **User Profile & Gamification:**
  * Interactive wallet detailing active balances and lifetime e-waste earnings.
  * Leaderboard ranking top environmental savers with dynamic profiles.
  * Gamified level system: 1 item sold yields 2 reward points. Unlocks badges like `Eco Warrior`, `Carbon Buster`, and `Urban Miner`.
* **Recycler Portal & Dashboard Analytics:**
  * Business login requiring certification uploads.
  * Real-time business analytics charts displaying items collected, revenue sheets, and regional collection heatmaps.
  * Orders Waiting: Grid displaying live requests, offering "Accept Pickup" and "Reject" buttons. Accept triggers live tracking progress statuses: `Booking Confirmed` -> `Agent Assigned` -> `Out for Pick Up` -> `Completed`.

---

## Verification Plan

### Automated & Component Testing
1. **Next.js Compile & Build Check:** Confirm compilation succeeds via `npm run build`.
2. **Visual Inspection:** Verify responsive, mobile-first layouts using diverse viewport presets (Mobile, Tablet, Desktop) on standard browser viewports.
3. **API Integrity Tests:** Perform request-response validations for:
   * `/api/ai/valuation` (manual valuation parameters)
   * `/api/ai/analyze-image` (mocking vision scans & yields)
   * `/api/transactions` (pickup lifecycle state changes)

### Manual Walkthrough
1. **Authentication Flow:** Sign up a recycler business, login, and confirm immediate redirection to the Business dashboard.
2. **Valuation Flow:** Scan a device, input diagnostic questions, review the generated urban mining yield report, click "Proceed", choose a recycler, and successfully book a pick-up.
3. **Recycler Pickup Pipeline:** Open the Recycler portal in an adjacent view, accept the order, verify status transitions to "Agent Assigned", then view the User Portal dashboard updating real-time tracking in unison.

---

## Next Steps

1. Run `npx create-next-app --help` to examine setup switches.
2. Bootstrap the Next.js TypeScript app.
3. Configure design tokens inside `tailwind.config.js` and `app/globals.css`.
4. Build the shared application state context (`AppContext.tsx`).
5. Develop page layouts, portal routes, and API engines.
6. Refine animations using `framer-motion`.
