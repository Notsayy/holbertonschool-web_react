# Task 8 - State Symphony (`task_6`)

This dashboard copies `task_5` and replaces the Context API and App's individual
state hooks with `useReducer`. `dashboard/src/App/appReducer.js` exports
`APP_ACTIONS`, `initialState`, and `appReducer` (also the default export).
Header and Footer receive the user and logout handler through props.

`App/App.js` uses React's `createElement` to preserve the existing rendered
structure in the required `.js` file without changing Vite's JSX configuration.
Login keeps the custom `useLogin` hook and WithLogging wrapper.

Axios loads notifications on mount and courses when the authenticated user
changes. Both lists start empty and responses are dispatched to the reducer.
Login and logout preserve dismissed notifications and do not trigger another
notifications request. Effect cleanup ignores responses after unmount or a
change in authentication.

Actions use a `payload`: credentials for `LOGIN`, a boolean for `TOGGLE_DRAWER`,
a notification id for `MARK_NOTIFICATION_READ`, and arrays for
`SET_NOTIFICATIONS` and `SET_COURSES`. `TOGGLE_DRAWER` without a payload inverts
visibility. `LOGOUT` clears credentials and courses while preserving the
notifications and drawer visibility; unknown actions return the same state.

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

Tests in `App.spec.js` cover reducer immutability and dashboard UI interactions,
including login and logout, drawer visibility, notification deletion, and data
fetching. Header and Footer tests use props instead of a Context Provider.
