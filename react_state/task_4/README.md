# Task 4 - Context consumer and advanced state

This dashboard builds on task 3. Footer remains a functional component and uses
the authentication context Consumer to show a Contact us link only when a user
exists and is logged in.

App stores notifications and courses in state. Clicking a notification calls
App's `markNotificationAsRead(id)`, logs
`Notification {id} has been marked as read`, and removes the item through a
functional state update without mutating the previous array.

Notifications extends PureComponent and forwards the callback to each item.
It responds to changed props, including same-length notification replacements.
Login still requires a valid email and an eight-character minimum password.
Logged-in users see Header's logout link and Footer's Contact us link.

## Running

Use Node.js 20 and npm 10. From `dashboard`:

```sh
npm install -g jest@29.7.0
npm ci
npm run dev
```

## Checks

```sh
npm test -- --runInBand
npm run lint
npm run build
```

Tests cover conditional Footer links, authentication, notification callbacks,
removal and logging, batched state updates, empty notifications, state-driven
courses, and PureComponent updates.
