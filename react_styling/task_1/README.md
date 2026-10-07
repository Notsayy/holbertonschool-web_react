# Task 0 - Set TailwindCSS

This task integrates TailwindCSS v4 into the React dashboard application using the `@tailwindcss/vite` plugin.

## What was done

- Copied `task_5` from the `react_component` project and renamed it `task_0`
- Installed `@tailwindcss/vite` and integrated it into `vite.config.js`
- Installed `@fontsource/roboto` for the Roboto font family
- Created `src/main.css` with:
  - TailwindCSS v4 `@import "tailwindcss"` directive
  - A `@theme` block defining Roboto as the default `sans` font family
  - A `@layer base` rule applying Roboto to the entire application
- Updated `src/main.jsx` with imports for Roboto weights 400, 500, and 700

## Requirements

- No TailwindCSS configuration file is created (uses CSS-first config via `@theme`)
- All 54 existing RTL unit tests continue to pass
