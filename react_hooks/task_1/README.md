# Task 1 - Convert Login to a functional component

This dashboard continues `task_0` with `Login` converted to a functional
component. It uses React state hooks to manage the controlled email and
password fields and enables submission only when the email and password meet
the existing validation rules. The `WithLogging` wrapper is retained.

## Running

Use Node.js 20 and npm 10. From `dashboard`, install dependencies with `npm ci`.
Run the checks with:

```sh
npm test -- --runInBand
npm run lint
npm run build
```

Tests cover form rendering, credential validation, submit behavior, and the
login callback.
