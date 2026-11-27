import rootReducer from './rootReducer';
import { login, logout } from '../features/auth/authSlice';
import { fetchCourses } from '../features/courses/coursesSlice';
import { hideDrawer } from '../features/notifications/notificationsSlice';

describe('rootReducer', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('initializes all three slices without warnings or errors', () => {
    const warn = jest.spyOn(console, 'warn');
    const error = jest.spyOn(console, 'error');

    jest.isolateModules(() => {
      const reducer = require('./rootReducer').default;
      expect(reducer(undefined, { type: 'unknown' })).toEqual({
        auth: { user: { email: '', password: '' }, isLoggedIn: false },
        notifications: { notifications: [], displayDrawer: true },
        courses: { courses: [] },
      });
    });
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  test('routes actions to their slices and resets courses on logout', () => {
    let state = rootReducer(undefined, { type: 'unknown' });
    state = rootReducer(state, login({ email: 'user@example.com', password: 'password' }));
    state = rootReducer(state, hideDrawer());
    state = rootReducer(state, fetchCourses.fulfilled([{ id: 1 }], 'request'));

    expect(state.auth.isLoggedIn).toBe(true);
    expect(state.notifications.displayDrawer).toBe(false);
    expect(state.courses.courses).toEqual([{ id: 1 }]);

    state = rootReducer(state, logout());
    expect(state.auth.isLoggedIn).toBe(false);
    expect(state.courses.courses).toEqual([]);
    expect(state.notifications.displayDrawer).toBe(false);
  });
});
