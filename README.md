# MEVHunter - Advanced Crypto Trading Automation

> **Prototype Notice:** This is a prototype application. Expect only basic functionality; other buttons and features are not yet fully implemented.
> 
> **Built by [JustineDevs]**
> 
> **Note:** This project is not affiliated with any project and is fully owned and maintained by [JustineDevs].

## Mission & Vision

### Mission
To empower crypto traders with cutting-edge automation tools for real-time DeFi monitoring, arbitrage detection, and secure wallet integration, making advanced trading accessible to all.

### Vision
To build a robust, secure, and scalable platform that redefines crypto trading automation by leveraging blockchain technology, modern web frameworks, and a user-centric design.

## Overview

MEVHunter is an advanced crypto trading automation platform designed for real-time DeFi and blockchain monitoring. It provides tools for detecting arbitrage and liquidation opportunities, integrating with Ethereum and Solana wallets, and ensuring top-tier security with features like rate limiting, CSRF protection, and bot detection. Built as a Progressive Web App (PWA), MEVHunter offers a modern, responsive, and mobile-first user experience with offline support and push notifications.

## Key Features

| Feature | Description |
|---------|-------------|
| Real-time Monitoring | Tracks DeFi protocols and blockchain events in real time |
| Arbitrage Detection | Identifies profitable arbitrage opportunities across exchanges |
| Liquidation Alerts | Monitors and alerts users to liquidation opportunities |
| Wallet Integration | Supports Ethereum (MetaMask) and Solana (Phantom) wallets |
| Responsive UI/UX | Mobile-first design with PWA support for seamless cross-device usage |
| Security | Implements rate limiting, CSRF protection, bot detection, geo-blocking, and input validation |
| Offline Support | Service Worker enables offline functionality and caching |
| Push Notifications | Real-time alerts for price changes, gas fees, and protocol events |

## Latest Updates (2025)

- **Explorer Tab & Widgets:**
  - Transaction History: Filterable, sortable table of demo transactions (win/lose/pending).
  - Transaction Status Chart: Pie chart for quick win/lose/pending insights.
  - Address/Domain Lookup: Searchable input for demo addresses/domains.
  - Profit/Loss Tracker: Bar chart summarizing outcomes by day.
  - Pending Transaction Monitor: Real-time updating list of pending transactions.
- **Interactive Dashboard:**
  - Time frame selector (5m, 1h, 1d, 7d, 30d) for the main chart.
  - Stat cards (Active Strategies, Total P&L, Risk Level, Gas Saved) update in real time with animated demo data.
- **Notifications & Social Links:**
  - Notifications bell with alert badge in the header.
  - Social media buttons (GitHub, LinkedIn, Twitter, Gmail, Telegram, Website) in the header.
  - Footer with "Built by JustineDevs" and a "Work with me" label.
- **Navigation:**
  - All 8 tabs (Dashboard, Arbitrage, Liquidation, Gas Optimizer, NFT Monitor, Trading, Security, Explorer) in a single row, grid layout, with custom icons.
- **UI/UX:**
  - All widgets and charts use Tailwind CSS, Radix UI, recharts, react-hook-form, and zod for validation.
  - No changes to existing design—new features are additive and fully integrated.

## Planned Features

The following features are planned to enhance MEVHunter's functionality:

- **Advanced Analytics Dashboard**: Visualize trading metrics and historical data with interactive charts
- **Multi-Chain Support**: Extend wallet and protocol integrations to additional blockchains
- **Automated Trading Bots**: Enable configurable trading strategies for arbitrage and liquidations
- **AI-Powered Insights**: Leverage machine learning for predictive market analysis
- **Custom Alert Configurations**: Allow users to set custom thresholds for alerts
- **Decentralized Identity**: Integrate with Web3 authentication providers
- **API Access**: Provide a public API for developers

## Project Structure

```
MEVHunter-Advanced-Crypto-Trading-Automation/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable React components
│   ├── ui/                # Shared UI components
│   └── blockchain/        # Blockchain-specific components
├── lib/                    # Utility functions and helpers
├── middleware/             # Next.js middleware for security
├── public/                 # Static assets
├── styles/                 # Global and module-specific CSS
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
├── services/               # API and blockchain service integrations
├── .env.local             # Environment variables (not tracked)
├── next.config.mjs        # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Framework | Next.js (App Router, Middleware, PWA) |
| Frontend | React, TypeScript |
| Styling | Tailwind CSS, Radix UI, Custom CSS Modules |
| State & Forms | React Hooks, react-hook-form, zod |
| Wallets | ethers.js, @solana/web3.js, MetaMask, Phantom |
| Security | Upstash Redis, CSRF protection, bot detection, geo-blocking |
| PWA | Service Worker, manifest, offline support, push notifications |
| Other | Lucide Icons, date-fns, recharts, clsx |

## Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^14.0.0 | Next.js framework for SSR, SSG, and API routes |
| react | ^18.2.0 | React library for building UI |
| react-dom | ^18.2.0 | React DOM for rendering |
| typescript | ^5.0.0 | TypeScript for type-safe JavaScript |
| @types/node | ^20.0.0 | Type definitions for Node.js |
| @types/react | ^18.2.0 | Type definitions for React |
| @types/react-dom | ^18.2.0 | Type definitions for React DOM |

### UI & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^3.3.0 | Utility-first CSS framework |
| @radix-ui/react-dialog | ^1.0.0 | Accessible dialog components |
| @radix-ui/react-dropdown-menu | ^2.0.0 | Dropdown menu components |
| @radix-ui/react-slot | ^1.0.0 | Slot components for composition |
| class-variance-authority | ^0.7.0 | Dynamic class management |
| clsx | ^2.0.0 | Utility for constructing className strings |
| lucide-react | ^0.294.0 | Icon library |
| tailwind-merge | ^2.0.0 | Merging Tailwind classes |

### Blockchain & Web3

| Package | Version | Purpose |
|---------|---------|---------|
| ethers | ^6.7.0 | Ethereum blockchain interactions |
| @solana/web3.js | ^1.87.0 | Solana blockchain interactions |
| @metamask/detect-provider | ^2.0.0 | MetaMask wallet detection |
| @upstash/redis | ^1.28.4 | Upstash Redis client for rate limiting and caching |
| @upstash/ratelimit | ^1.0.1 | Upstash Ratelimit for distributed rate limiting |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | ^7.45.0 | Form management and validation |
| zod | ^3.22.0 | Schema validation |
| @hookform/resolvers | ^3.3.0 | Resolver for react-hook-form with zod |

### Data Visualization & Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| recharts | ^2.9.0 | Charting library for data visualization |
| date-fns | ^2.30.0 | Date manipulation utilities |
| axios | ^1.6.0 | HTTP client for API requests |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| autoprefixer | ^10.4.0 | PostCSS plugin for vendor prefixes |
| postcss | ^8.4.0 | CSS post-processing |
| prettier | ^3.0.0 | Code formatter |
| prettier-plugin-tailwindcss | ^0.5.0 | Tailwind CSS support for Prettier |
| eslint | ^8.0.0 | Linting for JavaScript/TypeScript |
| eslint-config-next | ^14.0.0 | ESLint configuration for Next.js |

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JustineDevs/MEVHunter-Advanced-Crypto-Trading-Automation.git
   cd MEVHunter-Advanced-Crypto-Trading-Automation
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the project root with your credentials:
   ```
   # Upstash Redis
   UPSTASH_REDIS_REST_URL="<your_upstash_redis_rest_url>"
   UPSTASH_REDIS_REST_TOKEN="<your_upstash_redis_rest_token>"
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Security & PWA

### Security Features
- Rate limiting via Upstash Redis for distributed request control
- Middleware-based CSRF protection, bot detection, and geo-blocking
- Input validation and sanitization using zod for secure form handling

### Progressive Web App (PWA)
- Service Worker for offline support and caching
- PWA manifest and icons for app-like installation and experience
- Push notifications for real-time alerts

## Contributing

We welcome contributions to MEVHunter! To contribute:

1. Fork the Repository:
   ```bash
   git clone https://github.com/JustineDevs/MEVHunter-Advanced-Crypto-Trading-Automation.git
   ```

2. Create a Branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make Changes:
   - Follow the coding style (Prettier, ESLint)
   - Ensure tests pass (if applicable)

4. Submit a Pull Request:
   - Push your branch: `git push origin feature/your-feature-name`
   - Open a pull request with a clear description of your changes
   - Reference any related issues

5. Report Bugs:
   - Open an issue with a detailed description of the bug
   - Include steps to reproduce

## Support

For questions, bug reports, or feature requests, please open an issue in this repository.

## License

This project is licensed under the MIT License.

## Troubleshooting

### Vercel Build Error: Endpoint URL must start with `http:` or `https:`
If you see this error during Vercel build, it means the Upstash Redis client is being initialized at build time without valid environment variables. To fix:
- Move the Redis initialization inside your API handler function.
- Use dynamic import for `@upstash/redis` only if the environment variables are valid.

Example:
```ts
let redis = null;
if (isValidRedis) {
  const { Redis } = await import("@upstash/redis");
  redis = new Redis({ url: redisUrl, token: redisToken });
}
```

### Installing Missing Dependencies
If you see errors like `Module not found: Can't resolve '@upstash/ratelimit'`, install the missing packages:
```sh
pnpm add @upstash/ratelimit @upstash/redis
```

## UI Design

The `UI Design` folder contains design mockups and assets for the MEVHunter platform. To view these designs in the app, visit the `/ui-design` page (to be implemented) or open the images directly from the `UI Design` directory.

### UI Design Gallery

Below are the latest UI design mockups for MEVHunter (click any image to zoom):

| Dashboard | Arbitrage | Liquidation |
|-----------|-----------|------------|
| [<img src="https://github.com/user-attachments/assets/bc9fdb07-c3fa-436e-b717-0d523e8354ac" width="200"/>](https://github.com/user-attachments/assets/bc9fdb07-c3fa-436e-b717-0d523e8354ac) | [<img src="https://github.com/user-attachments/assets/6ceedc31-c728-40dd-88f1-6e9b531cc24e" width="200"/>](https://github.com/user-attachments/assets/6ceedc31-c728-40dd-88f1-6e9b531cc24e) | [<img src="https://github.com/user-attachments/assets/2e54c7b5-e666-4034-9586-3bd79b6d4e69" width="200"/>](https://github.com/user-attachments/assets/2e54c7b5-e666-4034-9586-3bd79b6d4e69) |

| Gas Optimization | NFT Monitor | Trading |
|------------------|-------------|---------|
| [<img src="https://github.com/user-attachments/assets/2563df6c-b1f8-47d3-a9cf-72cfd77d3f98" width="200"/>](https://github.com/user-attachments/assets/2563df6c-b1f8-47d3-a9cf-72cfd77d3f98) | [<img src="https://github.com/user-attachments/assets/69cee863-0ef1-4921-b3cd-545afd946353" width="200"/>](https://github.com/user-attachments/assets/69cee863-0ef1-4921-b3cd-545afd946353) | [<img src="https://github.com/user-attachments/assets/edd5e65e-e7a8-427c-a36c-14ec1922e917" width="200"/>](https://github.com/user-attachments/assets/edd5e65e-e7a8-427c-a36c-14ec1922e917) |

| Security | Explorer |
|----------|----------|
| [<img src="https://github.com/user-attachments/assets/95c3f958-0d11-4fd5-a05b-611adf64d88c" width="200"/>](https://github.com/user-attachments/assets/95c3f958-0d11-4fd5-a05b-611adf64d88c) | [<img src="https://github.com/user-attachments/assets/e9f05a00-a126-47a3-8cb3-f3d3b533e994" width="200"/>](https://github.com/user-attachments/assets/e9f05a00-a126-47a3-8cb3-f3d3b533e994) |

---

**Built by [JustineDevs] | 2025**
