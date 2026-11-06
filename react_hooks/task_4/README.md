# Tasks 5 and 6 - Modernize App and Side Effects (`task_4`)

This dashboard continues `task_3` with `App` converted to a functional
component. React state hooks manage the drawer, context user, and notifications;
memoized callbacks preserve child prop identity, and immutable updates retain
notification and authentication behavior.

Axios loads notifications on mount and courses when the authenticated user
changes. Both lists start empty. Login and logout preserve dismissed
notifications and do not trigger another notifications request.

The login button is enabled only for a valid email and a password of at least
eight characters. The form submission handler prevents navigation and forwards
the current credentials to `logIn`. The welcome message keeps the email in the
same text node for consistent text queries.

## Running

Use Node.js 20 and npm 10. From `dashboard`, install dependencies with `npm ci`.
Run the checks with:

```sh
npm test -- --runInBand
npm run lint
npm run build
```

Tests cover dashboard rendering, login and logout, notification drawer
interactions, and marking notifications as read.
