# Task 1 - Authentication Slice

The authentication slice in `dashboard/src/features/auth/authSlice.js` manages
login credentials and authentication status with Redux Toolkit. Its `login`
action accepts an email and password, and its `logout` action resets the state.

The existing application continues to use its original reducer; the slice
prepares authentication state for Redux integration in subsequent tasks.

From `dashboard`, run `npm install` to install dependencies, `npm test -- --runInBand`
to run tests, `npm run lint` to check lint, and `npm run build` to build the app.
