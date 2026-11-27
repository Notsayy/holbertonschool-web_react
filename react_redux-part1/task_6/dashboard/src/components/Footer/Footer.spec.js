import { act, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Footer from './Footer';
import authReducer, { login, logout } from '../../features/auth/authSlice';

test('displays the copyright and updates the contact link with authentication', () => {
  const store = configureStore({ reducer: { auth: authReducer } });

  render(
    <Provider store={store}>
      <Footer />
    </Provider>
  );

  const copyright = screen.getByText(/copyright/i);
  expect(copyright).toHaveTextContent(new RegExp(`copyright ${new Date().getFullYear()}`, 'i'));
  expect(copyright).toHaveTextContent(/holberton school/i);
  expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument();

  act(() => {
    store.dispatch(login({ email: 'test@test.com', password: 'password123' }));
  });
  expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
  expect(screen.getByText(/copyright/i)).toBeInTheDocument();

  act(() => {
    store.dispatch(logout());
  });
  expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument();
  expect(screen.getByText(/copyright/i)).toBeInTheDocument();
});
