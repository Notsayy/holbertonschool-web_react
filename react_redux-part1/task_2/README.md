# Task 2 - Create a root reducer

This task combines the authentication, notifications, and courses reducers
into one root reducer using Redux Toolkit's `combineReducers`.

The resulting state is organized under the `auth`, `notifications`, and
`courses` keys, and `rootReducer` is the module's default export.

The slices and notification utility are carried over from task 1. From
`dashboard`, run `npm install`, `npm test -- --runInBand`, and `npm run lint`
to install dependencies, run the integration tests, and check lint.
