# Task 2 - Context

This dashboard builds on task 1 with authentication managed by App state.
`src/Context/context.js` exports a default React context containing an empty
user (`email`, `password`, and `isLoggedIn`) and a no-op `logOut` function.

App provides its state directly as the context value to preserve reference
identity between renders without state changes. Its `logIn` method stores the
credentials and displays CourseList instead of Login. The state-backed `logOut`
function clears credentials and returns to Login; Ctrl+H also logs out.
Notifications continue to work independently of authentication.

Login initializes controlled fields from props and calls its `logIn` prop on
submission without reloading the page. Submission requires a valid email and
a password of at least eight characters.

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

Tests cover login validation and callbacks, authentication state, context
defaults and provider identity, logout, and notification behavior.
