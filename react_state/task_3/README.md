# Task 3 - Log Out implementation

This dashboard builds on task 2. Header uses `contextType` to read the
authentication context provided by App.

When `user.isLoggedIn` is true, Header renders `#logoutSection` with
"Welcome **email** (*logout*)". Clicking logout calls the context `logOut`
function, which clears App's user state and displays Login again. Users can
log in and log out repeatedly.

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

Header tests cover default and logged-in contexts and the logout spy. App
tests drive authentication through state and the UI, verifying login,
Header logout, re-login, keyboard logout, and notification behavior.
