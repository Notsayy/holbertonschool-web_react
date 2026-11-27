import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import coursesReducer, { fetchCourses } from '../courses/coursesSlice';
import authReducer, { login, logout } from '../auth/authSlice';

const coursesUrl = 'http://localhost:5173/courses.json';
const courses = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
];

afterEach(() => {
  mockAxios.reset();
});

describe('coursesSlice', () => {
  test('returns the initial state by default', () => {
    expect(coursesReducer(undefined, { type: 'unknown' })).toEqual({ courses: [] });
  });

  test('fetches courses and replaces the previous list with the response data', async () => {
    const store = configureStore({
      reducer: coursesReducer,
      preloadedState: { courses: [{ id: 3, name: 'React', credit: 40 }] },
    });

    const request = store.dispatch(fetchCourses());
    expect(mockAxios.get).toHaveBeenCalledWith(coursesUrl, { signal: expect.any(AbortSignal) });
    mockAxios.mockResponseFor({ url: coursesUrl }, { data: { courses } });
    const action = await request;

    expect(fetchCourses.fulfilled.match(action)).toBe(true);
    expect(action.payload).toEqual(courses);
    expect(store.getState()).toEqual({ courses });
  });

  test('resets courses when the auth logout action is dispatched', () => {
    const store = configureStore({
      reducer: { auth: authReducer, courses: coursesReducer },
      preloadedState: { courses: { courses } },
    });
    store.dispatch(login({ email: 'user@example.com', password: 'password123' }));
    const previousCoursesState = store.getState().courses;

    store.dispatch(logout());

    expect(store.getState().courses).toEqual({ courses: [] });
    expect(store.getState().auth.isLoggedIn).toBe(false);
    expect(previousCoursesState).toEqual({ courses });
    store.dispatch(logout());
    expect(store.getState().courses).toEqual({ courses: [] });
  });

  test('rejects a failed request without replacing the existing courses', async () => {
    const store = configureStore({
      reducer: coursesReducer,
      preloadedState: { courses },
    });

    const request = store.dispatch(fetchCourses());
    mockAxios.mockError(new Error('Network Error'));
    const action = await request;

    expect(fetchCourses.rejected.match(action)).toBe(true);
    expect(action.error.message).toBe('Network Error');
    expect(store.getState()).toEqual({ courses });
  });
});

