# Task 6 - Synchronize Header with Redux

This task builds on the application from task 1 and the combined reducer from
task 2. The `Header` component reads `isLoggedIn` and `user` from the Redux
`auth` state and dispatches the `logout` action when the logout link is clicked.

The application has not yet been wrapped in a Redux `Provider`; app-level
rendering and integration tests may fail until that is added in a later task.
The Header tests provide a Redux store directly.

From `dashboard`, run `npm test -- --runInBand` to run tests, `npm run lint`
to check lint, and `npm run build` to build the app.
