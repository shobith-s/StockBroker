# Stock Broker Dashboard

A modern, real-time stock tracking dashboard built with Next.js 15, TypeScript, and Tailwind CSS v4. Track your favorite stocks with interactive charts, price history, and live updates.

## Live Demo

**Production:** [https://stock-broker-dashboard-beryl.vercel.app/](https://stock-broker-dashboard-beryl.vercel.app/)

## Features

### Core Functionality
- ** Email-Based Login** - Simple authentication (no password required)
- ** Real-Time Price Updates** - Stock prices update every second
- ** Stock Subscription** - Subscribe to GOOG, TSLA, AMZN, META, NVDA
- ** Multi-User Support** - Independent portfolios per user
- ** Session Persistence** - Data saved in browser localStorage

### Advanced Features
- ** Interactive Charts** - Sparkline and detailed area charts with Recharts
- ** Time Range Filters** - View price history by Day (24h), Month (30d), or Year (365d)
- ** Price History** - Tracks up to 100 data points per stock
- ** 24h High/Low Tracking** - Automatic monitoring of price extremes
- ** Portfolio Summary** - Total value, gain/loss, and performance metrics
- ** Premium UI** - Gradient backgrounds, animations, and modern design

##  Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Framer Motion

##  Installation

```bash
# Clone the repository
git clone https://github.com/shobith-s/StockBroker.git
cd StockBroker

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

##  Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

Or deploy via [Vercel Dashboard](https://vercel.com/new) by connecting your GitHub repository.

##  Usage

### Getting Started

1. **Login**
   - Enter any email address (e.g., `trader@example.com`)
   - Click "Access Dashboard"

2. **Subscribe to Stocks**
   - Navigate to "Add Stocks" tab
   - Click stock buttons or enter ticker manually
   - Supported stocks: GOOG, TSLA, AMZN, META, NVDA

3. **View Portfolio**
   - Real-time price updates every second
   - Sparkline charts show recent trends
   - Click time range buttons (Day/Month/Year) to filter history
   - View 24h high/low prices

4. **Logout**
   - Click "Logout" button to clear session

### Multi-User Support

Each user's data is isolated in browser localStorage:
- Different users can login with different emails
- Each user sees only their subscribed stocks
- Data persists until logout or cache clear

##  Project Structure

```
STB/
├── app/
│   ├── globals.css          # Tailwind config + custom styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   └── ui/
│       ├── stock-broker-dashboard.tsx  # Main dashboard
│       ├── stock-chart.tsx             # Detailed charts
│       ├── sparkline.tsx               # Mini trend charts
│       ├── border-beam.tsx             # Animated effects
│       └── ...                         # Other UI components
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

##  Features in Detail

### Price History Tracking
- Stores up to 100 historical price points per stock
- Real-time accumulation as prices update
- Automatic data management (removes oldest when limit reached)

### Interactive Charts
- **Sparkline Charts:** Mini trend visualization on each card
- **Detailed Area Charts:** Full price history with gradient fill
- **Time Range Filters:** Day (24h), Month (30d), Year (365d)
- **Interactive Tooltips:** Exact price and timestamp on hover

### Portfolio Summary
- Total portfolio value calculation
- Overall gain/loss percentage
- Stock count tracking
- Real-time performance indicators

##  Configuration

### Supported Stocks

Currently supports 5 stocks (configurable in `stock-broker-dashboard.tsx`):
- **GOOG** - Google
- **TSLA** - Tesla
- **AMZN** - Amazon
- **META** - Meta (Facebook)
- **NVDA** - NVIDIA

### Price Update Interval

Default: 1000ms (1 second)

To change, modify the interval in `stock-broker-dashboard.tsx`:
```tsx
setInterval(() => {
  // Price update logic
}, 1000) // Change this value
```

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

**Live Demo:** [https://stock-broker-dashboard-beryl.vercel.app/](https://stock-broker-dashboard-beryl.vercel.app/)
