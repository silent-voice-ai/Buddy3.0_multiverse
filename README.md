# BUDDY 3.0 — Money Multiverse

A complete money-management web app with three age-based worlds: Little Saver (Kids 3–10), Teen Moneyverse (11–18), and Young Investor Pro (18–25).

## Features

- **Three age-based worlds** with distinct themes and features
- **Email/password authentication** with protected routes
- **Spending tracker** with live Chart.js bar chart
- **Budget manager** with progress bar and warnings
- **Goals** with progress tracking
- **Investment tracker** with growth calculation
- **UPI Round-Up savings** simulation (always on for Teens, toggle for Youth)
- **Friends Savings Royale** leaderboard (Teens)
- **Talk to Future Self** — time-locked letters
- **Roaster** — friendly spending-based roasts
- **BUDDY Store** — digital products with Razorpay Payment Link placeholders
- **Privacy Policy & Terms of Use** pages
- **Settings** — change age group, currency, reset data, delete account
- **localStorage** for all app data (no server required)
- Mobile-responsive with sidebar (desktop) and bottom nav (mobile)

## Tech Stack

- Next.js 13 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Chart.js + react-chartjs-2
- shadcn/ui components
- lucide-react icons

## Local Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Build for Production

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Push this project to a GitHub/GitLab/Bitbucket repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js — no configuration needed
4. Click **Deploy**
5. Your app will be live at `https://<your-project>.vercel.app`

### Environment Variables

No environment variables are required. All data is stored in the browser via localStorage.

## BUDDY Store — Razorpay Setup

The BUDDY Store uses Razorpay Payment Links. To enable payments:

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Create Payment Links for each product
3. Replace the placeholders in `components/buddy-store.tsx`:
   - `ADD_RAZORPAY_LINK_1` → Your Starter Pack payment link
   - `ADD_RAZORPAY_LINK_2` → Your Teen Investor Kit payment link
   - `ADD_RAZORPAY_LINK_3` → Your Complete Pack payment link
4. Each Buy Now button opens the link in a new tab

**Note:** BUDDY does not collect UPI PIN, OTP, bank passwords, or card details. All payment processing is handled by Razorpay.

## Project Structure

```
app/
  page.tsx              # Landing page
  signup/               # Sign up page
  signin/               # Sign in page
  age-selection/        # Age group selection
  privacy/              # Privacy Policy
  terms/                # Terms of Use
  store/                # Standalone store page
  dashboard/
    layout.tsx          # Dashboard layout with sidebar + bottom nav
    page.tsx            # Main dashboard (age-specific)
    spending/           # Spending tracker page
    budget/             # Budget manager page
    goals/              # Goals page
    investments/        # Investments page (Teens & Youth)
    future-self/        # Talk to Future Self page
    roaster/            # Roaster page (Teens)
    store/              # BUDDY Store page
    settings/           # Settings page
components/
  spending-form.tsx     # Add expense form
  spending-chart.tsx    # Chart.js bar chart
  spending-list.tsx     # Expense list with delete
  budget-manager.tsx    # Budget tracker with progress
  investment-card.tsx   # Investment tracker
  round-up-display.tsx  # UPI Round-Up savings display
  future-self.tsx       # Time-locked messages
  roaster.tsx           # Friendly spending roaster
  buddy-store.tsx       # Store with Razorpay links
  ui/                   # shadcn/ui components
lib/
  types.ts              # TypeScript types
  storage.ts            # localStorage helpers
  auth.tsx              # Auth context provider
  format.ts             # Currency/date formatting
  useAppData.ts         # App data hook
  themes.ts             # Age group themes
```

## Data Storage

All app data is stored in the browser's localStorage:
- `buddy_users` — user accounts (with hashed passwords)
- `buddy_current_user` — current logged-in user ID
- `buddy_app_data` — all app data (expenses, goals, investments, etc.)

No data is sent to any server.

## License

© 2026 BUDDY 3.0
