# Task 3 - Memoize Notifications

This dashboard continues `task_2` with `Notifications` converted from a class
component to a memoized function component. A custom props comparator avoids
unnecessary renders while ensuring updates to notifications and event handlers
are reflected. `NotificationItem` remains memoized and mark-as-read behavior
is preserved.

## Running

Use Node.js 20 and npm 10. From `dashboard`, install dependencies with `npm ci`.
Run the checks with:

```sh
npm test -- --runInBand
npm run lint
npm run build
```

Tests cover notification rendering, memo comparison, and the notification
callbacks.
