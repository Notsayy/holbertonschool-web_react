# Task 0 - Update project structure

This task reorganizes the project structure to prepare the application for Redux Toolkit integration and state management.

## What was done

- Installed `@reduxjs/toolkit` and `react-redux` packages
- Reorganized `src/` directory into a modular structure:
  - `src/app/`: Redux store and root reducer configurations (`store.js`, `rootReducer.js`)
  - `src/features/`: Feature-specific slices (`auth/authSlice.js`, `notifications/notificationsSlice.js`, `courses/coursesSlice.js`)
  - `src/components/`: Reusable presentational components (`Header`, `Footer`, `BodySection`, `BodySectionWithMarginBottom`, `HOC`, `NotificationItem`, `Notifications`)
  - `src/pages/`: Page-level components (`CourseList`, `CourseList/CourseListRow`, `Login`)
  - `src/hooks/`: Custom React hooks (`useLogin.jsx`)
  - `src/utils/`: Utility functions and helper tests (`utils.js`, `utils.spec.js`)
  - `src/assets/`: Application assets (`close-icon.png`, `holberton-logo.jpg`)
  - `src/tests/`: Application-level test suites (`App.spec.js`)
  - `src/`: Root components and entry points (`App.jsx`, `appReducer.js`, `main.jsx`, `main.css`)
- Updated all relative import paths across components and test files
- Ensured all unit tests pass and application builds successfully

