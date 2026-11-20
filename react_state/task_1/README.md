# Task 1 - Controlled components and state callback

The dashboard builds on task 0 with a class-based Login component. Its constructor
initializes `isLoggedIn`, `email`, `password`, and `enableSubmit`.

Email and password are controlled inputs. State callbacks validate the latest
values, enabling submission only for a valid email and a password of at least
8 characters. Submission prevents page reload and sets local `isLoggedIn` to
`true`; displaying CourseList remains the responsibility of a later task.

## Running the dashboard

Use Node.js 20 and npm 10. From the `dashboard` folder:

```sh
npm install -g jest@29.7.0
npm ci
npm run dev
```

## Checks

```sh
npm test -- --runInBand
npm run lint
npm run build
```

Login tests cover initial state, controlled inputs, default disabled submission,
email validation, the eight-character password boundary, revalidation in either
input order, and preventing page reload.
