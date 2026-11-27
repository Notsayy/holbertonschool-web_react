import { act, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import mockAxios from 'jest-mock-axios';
import CourseList from './CourseList';
import coursesReducer, { fetchCourses } from '../../features/courses/coursesSlice';
import { logout } from '../../features/auth/authSlice';

test('displays fetched courses and updates when they are reset', async () => {
  const store = configureStore({ reducer: { courses: coursesReducer } });
  const courses = [
    { id: 1, name: 'ES6', credit: 60 },
    { id: 2, name: 'Webpack', credit: 20 },
    { id: 3, name: 'React', credit: 40 },
  ];

  render(
    <Provider store={store}>
      <CourseList />
    </Provider>
  );

  expect(screen.getAllByRole('row')).toHaveLength(1);
  expect(screen.getByText('No course available yet')).toBeInTheDocument();

  await act(async () => {
    const request = store.dispatch(fetchCourses());
    mockAxios.mockResponseFor(
      { url: 'http://localhost:5173/courses.json' },
      { data: { courses } }
    );
    await request;
  });

  expect(screen.getAllByRole('row')).toHaveLength(5);
  expect(screen.getByText('Available courses')).toBeInTheDocument();
  expect(screen.getByText('Course name')).toBeInTheDocument();
  expect(screen.getByText('Credit')).toBeInTheDocument();
  for (const course of courses) {
    expect(screen.getByText(course.name)).toBeInTheDocument();
    expect(screen.getByText(String(course.credit))).toBeInTheDocument();
  }

  act(() => {
    store.dispatch(logout());
  });

  expect(screen.getAllByRole('row')).toHaveLength(1);
  expect(screen.getByText('No course available yet')).toBeInTheDocument();
  mockAxios.reset();
});

test('remains wrapped in WithLogging', () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  const store = configureStore({ reducer: { courses: coursesReducer } });

  const { unmount } = render(
    <Provider store={store}>
      <CourseList />
    </Provider>
  );
  expect(log).toHaveBeenCalledWith('Component CourseList is mounted');

  unmount();
  expect(log).toHaveBeenCalledWith('Component CourseList is going to unmount');
  log.mockRestore();
});
