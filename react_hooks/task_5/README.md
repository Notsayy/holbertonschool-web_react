# Task 7 - Custom React Hook (`task_5`)

This dashboard copies `task_4` and extracts Login's form state, validation,
and submission logic into `dashboard/src/hooks/useLogin.jsx`. The Login
component keeps its JSX and WithLogging wrapper.

Axios loads notifications on mount and courses when the authenticated user
changes. Both lists start empty. Login and logout preserve dismissed
notifications and do not trigger another notifications request.

The login button is enabled only for a valid email and a password of at least
eight characters. The hook prevents navigation on every submission and calls
`onLogin(email, password)` only when both values are valid, including on direct
form submissions. It returns `email`, `password`, `enableSubmit`,
`handleChangeEmail`, `handleChangePassword`, and `handleLoginSubmit`.

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
