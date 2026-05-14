# LeetLab frontend

React client for the LeetLab backend: authentication, problem browsing, coding workspace (Monaco), playlists, submissions, and admin flows for adding problems.

## Stack

- **React 19** + **Vite 8**
- **React Router 7** — client-side routing
- **Tailwind CSS 4** + **DaisyUI** — styling
- **Zustand** — client state
- **Axios** — HTTP (`withCredentials` for cookie-based auth)
- **Monaco Editor** — in-browser code editing
- **React Hook Form** + **Zod** — forms and validation
- **react-hot-toast** — notifications
- **lucide-react** — icons

The template enables the **React Compiler** (Babel preset). See [React Compiler](https://react.dev/learn/react-compiler) for behavior and trade-offs (dev/build performance).

## Prerequisites

- **Node.js** (LTS recommended)
- A running **LeetLab API** that matches the routes this app calls (see repository backend)

## Setup

```bash
cd frontend
npm install
```

Create a `.env` in `frontend` (Vite only exposes variables prefixed with `VITE_`):

```env
VITE_API_BASE_URL=http://localhost:5000
```

`src/lib/axios.js` builds the client as `{VITE_API_BASE_URL}/api/v1`. Adjust the port to match your backend. CORS and cookies must be configured on the server for the origin you use in the browser.

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start Vite dev server (HMR)    |
| `npm run build`| Production build to `dist/`    |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint on the project      |

## Routes (high level)

These match `src/App.jsx`:

| Path            | Notes                                      |
| --------------- | ------------------------------------------ |
| `/`             | Home when logged in; else redirect to login |
| `/login`        | Login                                      |
| `/singup`       | Sign up (URL spelling matches app)         |
| `/logout`       | Logout when authenticated                  |
| `/problem/:id`  | Problem detail / editor (auth required)    |
| `/add-problem`  | Admin-only nested route                    |

## Project layout

```
frontend/
├── public/          # Static assets (favicon, icons)
├── src/
│   ├── components/  # Reusable UI (navbar, tables, modals, etc.)
│   ├── layout/      # App shell (e.g. Layout)
│   ├── lib/         # axios instance, helpers (e.g. lang)
│   ├── page/        # Route-level pages
│   ├── store/       # Zustand stores (auth, problems, playlists, …)
│   ├── App.jsx      # Routes and auth gate
│   ├── main.jsx     # Entry + BrowserRouter
│   └── index.css    # Global styles / Tailwind
├── index.html
├── vite.config.js   # React, Tailwind, Babel (React Compiler)
└── eslint.config.js
```

## ESLint / TypeScript

This app uses **JavaScript** and ESLint 9. For stricter, type-aware linting in production apps, consider migrating toward the [Vite React + TypeScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) and [`typescript-eslint`](https://typescript-eslint.io).

## Official Vite React plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — Oxc-based transform
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — SWC-based alternative
