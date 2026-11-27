import { act, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import CourseList from './CourseList';
import coursesReducer, { fetchCourses } from '../../features/courses/coursesSlice';
import { logout } from '../../features/auth/authSlice';

test('displays courses from the store and updates when they are reset', () => {
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

  act(() => {
    store.dispatch(fetchCourses.fulfilled(courses, 'request'));
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
