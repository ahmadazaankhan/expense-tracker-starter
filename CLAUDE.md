# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Starter project for a Claude Code course. A React expense/finance tracker that intentionally ships with a bug, poor UI, and messy code — these are meant to be found and fixed during the course, so don't "clean up" issues without being asked.

## Architecture

- The add-transaction form still stores `amount` as a raw string from the input; only the totals `reduce` coerces it with `Number()`. New transactions mix string amounts into an array whose seed data is numeric — watch for this if you add more numeric logic on `amount`.
