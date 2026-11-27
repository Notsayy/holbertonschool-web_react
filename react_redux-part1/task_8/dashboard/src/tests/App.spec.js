import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import mockAxios from 'jest-mock-axios';
import App from '../App';
import rootReducer from '../app/rootReducer';
import { login } from '../features/auth/authSlice';

const notificationsUrl = 'http://localhost:5173/notifications.json';
const coursesUrl = 'http://localhost:5173/courses.json';
const notifications = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
];
const courses = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
];

const renderApp = (loggedIn = false) => {
  const store = configureStore({ reducer: rootReducer });
  if (loggedIn) {
    store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
  }
  const result = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  return { store, ...result };
};

afterEach(() => {
  mockAxios.reset();
  jest.restoreAllMocks();
});

test('shows login and fetches notifications, but not courses, when logged out', async () => {
  renderApp();

  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Log in to continue' })).toBeInTheDocument();
  expect(mockAxios.get).toHaveBeenCalledWith(notificationsUrl, { signal: expect.any(AbortSignal) });
  expect(mockAxios.get).not.toHaveBeenCalledWith(coursesUrl, expect.anything());

  await act(async () => {
    mockAxios.mockResponseFor({ url: notificationsUrl }, { data: { notifications } });
  });
  expect(screen.getByText('New course available')).toBeInTheDocument();
  expect(screen.getByText('New resume available')).toBeInTheDocument();
});

test('shows courses and fetches them when already logged in', async () => {
  renderApp(true);

  expect(screen.getByRole('heading', { name: 'Course list' })).toBeInTheDocument();
  expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
  expect(mockAxios.get).toHaveBeenCalledWith(coursesUrl, { signal: expect.any(AbortSignal) });

  await act(async () => {
    mockAxios.mockResponseFor({ url: notificationsUrl }, { data: { notifications } });
    mockAxios.mockResponseFor({ url: coursesUrl }, { data: { courses } });
  });
  expect(screen.getByText('ES6')).toBeInTheDocument();
  expect(screen.getByText('Webpack')).toBeInTheDocument();
});

test('fetches courses after login and resets them on logout', async () => {
  const { store } = renderApp();
  await act(async () => {
    mockAxios.mockResponseFor({ url: notificationsUrl }, { data: { notifications } });
  });

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: 'OK' }));

  expect(store.getState().auth.isLoggedIn).toBe(true);
  expect(mockAxios.get).toHaveBeenCalledWith(coursesUrl, { signal: expect.any(AbortSignal) });
  await act(async () => {
    mockAxios.mockResponseFor({ url: coursesUrl }, { data: { courses } });
  });
  expect(screen.getByText('ES6')).toBeInTheDocument();

  fireEvent.click(screen.getByText('(logout)'));
  expect(store.getState().auth.isLoggedIn).toBe(false);
  expect(store.getState().courses.courses).toEqual([]);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
});

test('ignores a course response after logging out', async () => {
  const { store } = renderApp(true);
  const courseRequest = mockAxios.get.mock.calls.find(([url]) => url === coursesUrl);
  await act(async () => {
    mockAxios.mockResponseFor({ url: notificationsUrl }, { data: { notifications } });
  });

  fireEvent.click(screen.getByText('(logout)'));
  expect(courseRequest[1].signal.aborted).toBe(true);
  await act(async () => {
    mockAxios.mockResponseFor({ url: coursesUrl }, { data: { courses } });
  });
  expect(store.getState().courses.courses).toEqual([]);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
});

test('reports failed notification requests', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  renderApp();
  await act(async () => {
    mockAxios.mockError(new Error('Network Error'));
  });

  await waitFor(() => {
    expect(error).toHaveBeenCalledWith(
      'Error fetching notifications:',
      expect.objectContaining({ message: 'Network Error' })
    );
  });
});
