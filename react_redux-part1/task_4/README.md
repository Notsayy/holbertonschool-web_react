# Task 7 - Synchronize Footer with Redux

This task builds on task 3. The `Footer` reads authentication state from the
Redux store and displays the contact link only when the user is logged in.
Copyright information remains visible in both authentication states.

The application has not yet been wrapped in a Redux `Provider`; app-level
rendering and integration tests may fail until that is added in a later task.
The Footer and Header tests provide a Redux store directly.

From `dashboard`, run `npm install` to install dependencies,
`npm test -- --runInBand` to run tests, `npm run lint` to check lint,
and `npm run build` to build the app.
