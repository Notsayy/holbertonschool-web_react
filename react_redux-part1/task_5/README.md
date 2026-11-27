# Task 8 - Synchronize CourseList with Redux

This task builds on task 4. `CourseList` reads the courses array from the
Redux store and remains wrapped in `WithLogging`. It displays the courses
table or the existing empty-state message according to the store's contents.

The application has not yet been wrapped in a Redux `Provider`, and its
existing course fetch still updates local state rather than Redux. App-level
rendering and integration remain to be addressed in later tasks. The component
tests provide a Redux store directly.

From `dashboard`, run `npm install` to install dependencies,
`npm test -- --runInBand` to run tests, `npm run lint` to check lint,
and `npm run build` to build the app.
