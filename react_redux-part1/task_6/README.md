# Task 9 - Synchronize Login with Redux

This task builds on task 5. `Login` uses the existing form hook for validation
and dispatches the auth slice's login action with the submitted credentials.

The application has not yet been wrapped in a Redux `Provider`, and its
authentication and course fetch still use local state. App-level rendering and
integration remain to be addressed in later tasks. The component tests provide
a Redux store directly.

From `dashboard`, run `npm install` to install dependencies,
`npm test -- --runInBand` to run tests, `npm run lint` to check lint,
and `npm run build` to build the app.
