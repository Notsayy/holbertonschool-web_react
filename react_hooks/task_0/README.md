# Task 0 - Convert Header to a functional component

This dashboard continues the `react_state` project. Header is a functional
component that reads authentication state with `useContext`, displays the
welcome message and logout link for logged-in users, and calls the context's
logout function when the link is selected. The remaining dashboard behavior is
carried forward from `react_state/task_4`.

## Running

Use Node.js 20 and npm 10. From `dashboard`, install dependencies with `npm ci`.
Run the checks with:

```sh
npm test -- --runInBand
npm run lint
npm run build
```

Tests cover Header rendering, conditional welcome/logout UI, and the logout
context callback.
