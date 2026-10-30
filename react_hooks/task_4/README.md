# Task 5 - Modernize App (`task_4`)

This dashboard continues `task_3` with `App` converted to a functional
component. React state hooks manage the drawer, context user, and notifications;
memoized callbacks preserve child prop identity, and immutable updates retain
notification and authentication behavior.

The implementation follows the task-specific conversion in
[reference commit `445f33d`](https://github.com/S1even/holbertonschool-web_react/commit/445f33ddd4ed3dace37d7c16f170813381b32274).
Later fixes in that repository add the next task's Axios effects, which are not
included here.

## Running

Use Node.js 20 and npm 10. From `dashboard`, install dependencies with `npm ci`.
Run the checks with:

```sh
npm test -- --runInBand
npm run lint
npm run build
```

Tests cover dashboard rendering, login and logout, notification drawer
interactions, and marking notifications as read.
