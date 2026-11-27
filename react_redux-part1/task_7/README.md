# Task 10 - Synchronize Notifications with Redux

This task builds on task 6. `Notifications` reads its list and drawer state
from Redux and dispatches actions to show, hide and mark notifications as read.

The application has not yet been wrapped in a Redux `Provider`, and its
authentication, notifications fetch and course fetch still use local state.
The notifications fetched by App are therefore not yet shown by the Redux
component. App-level integration remains to be addressed in later tasks; the
component tests provide a Redux store directly.

From `dashboard`, run `npm install` to install dependencies,
`npm test -- --runInBand` to run tests, `npm run lint` to check lint,
and `npm run build` to build the app.
