# Sidebet — Frontend

The web interface for **Sidebet**, a private prediction market for friend groups —
like Kalshi, but the currency is virtual points instead of money. Users browse open
markets, place wagers, and watch a live leaderboard of who's winning their bets.

This repository is the **frontend** (React + Vite). It talks to a Spring Boot API
in a separate repo: [Sidebet](https://github.com/jsanchez04/Sidebet).

> **Live demo:** `https://<your-vercel-url>.vercel.app`

## Screenshot

> _Add a screenshot here — drag an image into this section while editing on GitHub,
> or save one to `public/` and reference it:_ `![Sidebet](public/screenshot.png)`

## Features

- Browse all open markets with their current status.
- A leaderboard ranking every player by point balance.
- Live data fetched from the backend API, with a one-click refresh.
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

The read-and-display experience (markets + leaderboard, live from the API) is
complete and deployed. Planned next:

- [ ] In-app buttons to create markets, place wagers, and resolve outcomes
      (no more curl)
- [ ] Multiple-outcome markets
- [ ] A live "chance %" per option

## License

This project is for portfolio and educational purposes.
