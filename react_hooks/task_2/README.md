# Task 2 - Memoize NotificationItem

This dashboard continues `task_1` with `NotificationItem` converted from a
class component to a memoized function component. It retains the existing
notification markup, props, default values, and mark-as-read behavior.

## Running

Use Node.js 20 and npm 10. From `dashboard`, install dependencies with `npm ci`.
Run the checks with:

```sh
npm test -- --runInBand
npm run lint
npm run build
```

Tests cover notification rendering, memoization, and the mark-as-read callback.
