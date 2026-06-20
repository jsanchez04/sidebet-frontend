# Sidebet — Frontend

The web interface for **Sidebet**, a private prediction market for friend groups —
like Kalshi, but the currency is virtual points instead of money. Users browse open
markets, place wagers, and watch a live leaderboard of who's winning their bets.

This repository is the **frontend** (React + Vite). It talks to a Spring Boot API
in a separate repo: [Sidebet](https://github.com/jsanchez04/Sidebet).

> **Live app:** https://sidebet-frontend.vercel.app
> (Backend on a free tier — the first load after inactivity may take ~30–50 seconds to wake up.)

## Screenshot
<img width="1005" height="497" alt="Screenshot 2026-06-19 at 8 47 32 PM" src="https://github.com/user-attachments/assets/9bbe070f-a470-47af-99eb-d0c40d906d43" />

## Features

- Browse all markets with a live YES/NO "chance %" bar derived from current wagers.
- Create new markets from the page (no API tools required).
- Place YES/NO wagers and resolve markets directly in the UI, with a user switcher
  to act as different friends.
- A leaderboard ranking every player by point balance, updating as bets resolve.
- Graceful error state when the backend is unreachable.

## Tech stack

| Layer       | Choice            |
|-------------|-------------------|
| Framework   | React             |
| Build tool  | Vite              |
| Language    | JavaScript (JSX)  |
| Styling     | Plain CSS         |
| Deployment  | Vercel            |

## Running locally

**Prerequisites:** Node.js 20+ and the [Sidebet backend](https://github.com/jsanchez04/Sidebet)
running on `http://localhost:8080`.

```bash
git clone https://github.com/jsanchez04/sidebet-frontend.git
cd sidebet-frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Configuration

The backend URL is set via an environment variable so the same code works locally
and in production:

| Variable        | Example                              | Used for                    |
|-----------------|--------------------------------------|-----------------------------|
| `VITE_API_URL`  | `http://localhost:8080`              | Base URL of the Sidebet API |

For local development, copy `.env.example` to `.env.local` and adjust if needed.
If the variable is unset, the app falls back to `http://localhost:8080`. In
production (Vercel), set `VITE_API_URL` to the deployed backend's URL.

## How it connects to the backend

On load, the app fetches `/markets` and `/users` from the API, renders the markets
list and a balance-sorted leaderboard, and exposes a Refresh button to re-fetch.
All requests go to the URL in `VITE_API_URL`.

## Project status & roadmap

The full interactive experience (create markets, place wagers, resolve outcomes,
live chance %, leaderboard) is complete and deployed. Planned next:

- [ ] Multiple-outcome markets (early / on time / 5 min late / …)
- [ ] Per-market closing times
- [ ] Real user accounts instead of a manual user switcher

## License

This project is for portfolio and educational purposes.

