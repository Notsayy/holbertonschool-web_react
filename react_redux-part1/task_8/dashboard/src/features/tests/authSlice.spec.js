import authReducer, { login, logout } from '../auth/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: { email: '', password: '' },
    isLoggedIn: false,
  };

  test('returns the initial state by default', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('logs in with the supplied credentials without mutating the previous state', () => {
    const previousState = authReducer(undefined, { type: 'unknown' });
    const credentials = { email: 'user@example.com', password: 'password123' };

    expect(authReducer(previousState, login(credentials))).toEqual({
      user: credentials,
      isLoggedIn: true,
    });
    expect(previousState).toEqual(initialState);
  });

  test('resets credentials and authentication status on logout without a payload', () => {
    const loggedInState = authReducer(
      undefined,
      login({ email: 'user@example.com', password: 'password123' })
    );

    expect(authReducer(loggedInState, logout())).toEqual(initialState);
    expect(loggedInState).toEqual({
      user: { email: 'user@example.com', password: 'password123' },
      isLoggedIn: true,
    });
  });
});
