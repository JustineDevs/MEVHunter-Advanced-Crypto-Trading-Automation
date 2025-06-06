# MEVHunter - Advanced Crypto Trading Automation

> **Note:** This project is not affiliated with v0.dev and is fully owned and maintained by [JustineDevs].

A modern, secure, and extensible crypto bot dashboard and automation suite. Built for DeFi, arbitrage, alerts, and advanced blockchain monitoring.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Middleware, PWA)
- **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), custom CSS modules
- **State & Forms:** React Hooks, [react-hook-form](https://react-hook-form.com/), [zod](https://zod.dev/)
- **Wallets:** [ethers.js](https://docs.ethers.org/), [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/), MetaMask, Phantom
- **Security:** Upstash Redis (rate limiting), CSRF protection, bot detection, geo-blocking, input validation/sanitization
- **PWA:** Service Worker, manifest, offline support, push notifications
- **Other:** [Lucide Icons](https://lucide.dev/), [date-fns](https://date-fns.org/), [recharts](https://recharts.org/), [clsx](https://github.com/lukeed/clsx)

## Overview

This repository is fully owned and maintained by [JustineDevs].

## Features
- Real-time DeFi and blockchain monitoring
- Arbitrage and liquidation opportunity detection
- Alerts for price, gas, and protocol events
- Wallet integration (ETH/Solana)
- Modern, responsive UI/UX (mobile-first, PWA support)
- Security and audit tools (rate limiting, CSRF, bot detection, geo-blocking, input validation)
- Service worker for offline support and push notifications
- Upstash Redis-powered rate limiting

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create a `.env.local` file in the project root with your Upstash Redis credentials:
   ```
   UPSTASH_REDIS_REST_URL="<your_upstash_redis_rest_url>"
   UPSTASH_REDIS_REST_TOKEN="<your_upstash_redis_rest_token>"
   ```
4. Start the dev server: `pnpm dev`
5. Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal)

## Security & PWA
- Implements rate limiting, bot detection, geo-blocking, and CSRF protection in middleware
- Uses Upstash Redis for distributed rate limiting
- Service worker for offline support, caching, and push notifications
- PWA manifest and icons included

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

## Support
For questions or support, please open an issue in this repository.

## License
MIT
