# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Starter project for a Claude Code course. A React expense/finance tracker that intentionally ships with a bug, poor UI, and messy code — these are meant to be found and fixed during the course, so don't "clean up" issues without being asked.

## Architecture

- `App.jsx` owns the `transactions` state (seeded with numeric `amount` values) and the shared `categories` list. It renders `Summary`, `TransactionForm`, and `TransactionList`, passing `transactions`/`categories` down as props.
- `Summary.jsx` receives `transactions` and derives `totalIncome`, `totalExpenses`, and `balance` itself via `reduce`, coercing `amount` with `Number()`.
- `TransactionForm.jsx` owns its own input state (`description`, `amount`, `type`, `category`) and calls `onAddTransaction` with a new transaction object on submit. It still stores `amount` as a raw string from the input — new transactions mix string amounts into an array whose seed data is numeric, so anything doing numeric logic on `amount` needs to coerce it (as `Summary` does).
- `TransactionList.jsx` owns the `filterType`/`filterCategory` state and renders the filters plus the transactions table from the filtered list.
