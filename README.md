# Job Tracker – Frontend

A React interface for the [Job Tracker backend](#) — add companies and applications, update status inline, and see everything at a glance.

## Tech Stack

- **Library:** React
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Language:** JavaScript (JSX)
- **Version Control:** Git, GitHub
- **Editor:** VS Code

## Features

- Add a company and an application, with the application referencing a real company by ID
- Duplicate-company check before creating (name + location combination)
- Inline status updates via dropdown, with a colored status dot for at-a-glance scanning
- Delete with a confirmation prompt
- Empty-state message when no applications exist yet

## Running locally

1. Install dependencies:
   ```
   npm install
   ```
2. Make sure the backend is running at `http://localhost:8080` (see backend README).
3. Start the dev server:
   ```
   npm run dev
   ```
4. Open the URL shown in the terminal (typically `http://localhost:5173`).

## Notes

The backend's `@CrossOrigin` configuration must allow requests from the frontend's origin (`http://localhost:5173` by default with Vite) for API calls to succeed.
