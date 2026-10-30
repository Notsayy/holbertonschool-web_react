import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import Notifications from '../Notifications/Notifications';
import { user as defaultUser } from '../Context/context';

const mockContextValues = [];

jest.mock('../Header/Header', () => {
  const { createElement, Fragment, useContext } = jest.requireActual('react');
  const { default: ActualHeader } = jest.requireActual('../Header/Header');
  const { default: context } = jest.requireActual('../Context/context');

  return {
    __esModule: true,
    default: function HeaderWithUserProbe() {
      const contextValue = useContext(context);
      mockContextValues.push(contextValue);

      return createElement(
        Fragment,
        null,
        createElement(ActualHeader),
        createElement(
          'output',
          { 'data-testid': 'user-state', hidden: true },
          JSON.stringify(contextValue.user)
        )
      );
    },
  };
});

const userState = () => JSON.parse(screen.getByTestId('user-state').textContent);

describe('App component', () => {
  beforeEach(() => {
    mockContextValues.length = 0;
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    try {
      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    } finally {
      jest.restoreAllMocks();
    }
  });

  test('renders the dashboard and news section', () => {
    render(<App />);
    expect(screen.getByAltText('holberton logo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /school dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /news from the school/i })).toBeInTheDocument();
  });

  test('starts logged out with the notification drawer open', () => {
    render(<App />);
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
    expect(screen.getByText('Here is the list of notifications')).toBeInTheDocument();
  });

  test('logs in with the submitted email and password', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345678');
    await user.click(screen.getByRole('button', { name: /ok/i }));

    expect(container.querySelector('#logoutSection')).toHaveTextContent(
      'Welcome user@example.com (logout)'
    );
    expect(container.querySelector('#CourseList')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact us' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'logout' })).toHaveLength(1);
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  test('logs out, clears credentials, and returns to the login form', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345678');
    await user.click(screen.getByRole('button', { name: /ok/i }));

    await user.click(container.querySelector('#logoutSection a'));

    expect(container.querySelector('#logoutSection')).toBeNull();
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled();
  });

  test('initializes user state from the context user', () => {
    render(<App />);
    expect(mockContextValues.at(-1).user).toBe(defaultUser);
    expect(userState()).toEqual({
      email: '',
      password: '',
      isLoggedIn: false,
    });
  });

  test('updates all user fields on login and clears them on logout', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const initialUser = mockContextValues.at(-1).user;

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret-password');
    await user.click(screen.getByRole('button', { name: /ok/i }));

    const loggedInUser = mockContextValues.at(-1).user;
    expect(userState()).toEqual({
      email: 'user@example.com',
      password: 'secret-password',
      isLoggedIn: true,
    });
    expect(loggedInUser).not.toBe(initialUser);
    expect(initialUser).toEqual(defaultUser);

    await user.click(container.querySelector('#logoutSection a'));

    expect(userState()).toEqual(defaultUser);
    expect(mockContextValues.at(-1).user).toBe(defaultUser);
    expect(loggedInUser).toEqual({
      email: 'user@example.com',
      password: 'secret-password',
      isLoggedIn: true,
    });
  });

  test('opens and closes the notification drawer with stable callbacks', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.notification-items')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(container.querySelector('.notification-items')).toBeNull();
    fireEvent.click(screen.getByText(/your notifications/i));
    expect(container.querySelector('.notification-items')).toBeInTheDocument();
  });

  test('keeps markNotificationAsRead stable between renders', () => {
    const notificationsSpy = jest.spyOn(Notifications, 'type');
    try {
      render(<App />);
      const initialCallback = notificationsSpy.mock.lastCall[0].markNotificationAsRead;

      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      fireEvent.click(screen.getByText(/your notifications/i));

      expect(notificationsSpy.mock.lastCall[0].markNotificationAsRead).toBe(initialCallback);
    } finally {
      notificationsSpy.mockRestore();
    }
  });

  test('removes a notification immutably when it is marked as read', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      render(<App />);
      fireEvent.click(screen.getByText('New course available'));
      expect(screen.queryByText('New course available')).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(consoleSpy).toHaveBeenCalledWith('Notification 1 has been marked as read');
    } finally {
      consoleSpy.mockRestore();
    }
  });

  test('does not register the removed Ctrl+H logout shortcut', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    try {
      render(<App />);
      fireEvent.keyDown(document, { ctrlKey: true, key: 'h' });
      expect(alertSpy).not.toHaveBeenCalled();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    } finally {
      alertSpy.mockRestore();
    }
  });
});
