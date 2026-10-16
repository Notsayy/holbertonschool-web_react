# Task 0 - Adding a local state for notifications

This task adds local state to the `App` component to control the visibility of the notifications drawer.

## What was done

- Added a local state `displayDrawer` in `App.jsx` initialized to `false` in the constructor
- Implemented `handleDisplayDrawer` to set `displayDrawer` to `true`
- Implemented `handleHideDrawer` to set `displayDrawer` to `false`
- Bound both handler methods in `App`'s constructor
- Passed `displayDrawer`, `handleDisplayDrawer`, and `handleHideDrawer` to the `Notifications` component as props
- Updated `Notifications.jsx` to call `handleDisplayDrawer` when clicking on "Your notifications"
- Updated `Notifications.jsx` to call `handleHideDrawer` when clicking on the close button
- Updated `shouldComponentUpdate` in `Notifications.jsx` to re-render when `displayDrawer` changes
- Defined `propTypes` and `defaultProps` for `handleDisplayDrawer` and `handleHideDrawer`
- Added tests in `Notifications.spec.js` to verify clicking the menu item calls `handleDisplayDrawer` and clicking the close button calls `handleHideDrawer`
- Added tests in `App.spec.js` to verify default `displayDrawer` state and that `handleDisplayDrawer` and `handleHideDrawer` update the state and UI accordingly
