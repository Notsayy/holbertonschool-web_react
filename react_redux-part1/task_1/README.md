# Redux Slices

The authentication slice in `dashboard/src/features/auth/authSlice.js` manages
login credentials and authentication status with Redux Toolkit. Its `login`
action accepts an email and password, and its `logout` action resets the state.

The notifications slice in `dashboard/src/features/notifications/notificationsSlice.js`
fetches notifications, marks them as read, and controls drawer visibility.
`fetchNotifications` returns a rejected action when the request fails.

The existing application continues to use its original reducer; the slices
prepare state for Redux integration in subsequent tasks.

From `dashboard`, run `npm install` to install dependencies, `npm test -- --runInBand`
to run tests, `npm run lint` to check lint, and `npm run build` to build the app.
