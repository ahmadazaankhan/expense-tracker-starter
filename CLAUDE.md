# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Starter project for a Claude Code course. A React expense/finance tracker that intentionally ships with a bug, poor UI, and messy code — these are meant to be found and fixed during the course, so don't "clean up" issues without being asked.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # run ESLint over the project
```

There is no test suite/framework configured in this repo.

## Architecture

- Plain Vite + React (JSX, no TypeScript). Entry point `src/main.jsx` mounts `<App />` from `src/App.jsx` into `#root`, wrapped in `StrictMode`.
- The entire app — state, derived totals, filtering, and the add-transaction form — lives in the single `App` component in `src/App.jsx`. There is no component decomposition, routing, or external state management; everything is local `useState`.
- Transactions are seeded as an in-memory array (no backend/persistence). Each transaction has `{ id, description, amount, type, category, date }`, where `type` is `"income" | "expense"` and `category` is one of the hardcoded `categories` list.
- `amount` is stored as a **string** (from seed data and from the form's raw input value) rather than a number. Totals are computed with `reduce((sum, t) => sum + t.amount, 0)`, which is prone to string-concatenation bugs when values aren't coerced to numbers — this is one of the intentional bugs.
- Styling is plain CSS in `src/App.css` and `src/index.css` (no CSS framework/preprocessor).
