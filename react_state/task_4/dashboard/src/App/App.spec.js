import { createRef } from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import newContext from '../Context/context';

const loggedInUser = {
  email: 'user@example.com',
  password: '12345678',
  isLoggedIn: true,
};

const setLoggedInState = (ref) => {
  act(() => ref.current.setState({ user: loggedInUser }));
};

describe('App component', () => {
  test('renders App component without crashing', () => {
    render(<App />);
  });

  test('renders News from the School section with default text', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 2, name: /news from the school/i });
    const paragraph = screen.getByText(/ipsum/i);
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });

  describe('when user state is logged out', () => {
    test('renders Login component and does not render CourseList', () => {
      const { container } = render(<App />);
      expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
      expect(container.querySelector('#CourseList')).toBeNull();
    });

    test('renders the h1 element with text School Dashboard', () => {
      render(<App />);
      const headingElement = screen.getByRole('heading', { level: 1, name: /school dashboard/i });
      expect(headingElement).toBeInTheDocument();
    });

    test('renders 2 input fields (one for email and the other for password)', () => {
      const { container } = render(<App />);
      const inputs = container.querySelectorAll('input:not([type="submit"])');
      expect(inputs.length).toBe(2);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('renders 2 label elements with the text Email and Password', () => {
      const { container } = render(<App />);
      const labels = container.querySelectorAll('label');
      expect(labels.length).toBe(2);
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/password/i)).toBeInTheDocument();
    });

    test('renders a button with the text OK', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
    });

    test('focuses the corresponding input field when clicking on a label element', async () => {
      render(<App />);
      const emailLabel = screen.getByText(/email/i);
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.click(emailLabel);
      expect(emailInput).toHaveFocus();

      const passwordLabel = screen.getByText(/password/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await userEvent.click(passwordLabel);
      expect(passwordInput).toHaveFocus();
    });
  });

  describe('when user state is logged in', () => {
    test('renders CourseList and unmounts Login after submitting valid credentials', async () => {
      const user = userEvent.setup();
      const ref = createRef();
      const { container } = render(<App ref={ref} />);
      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), '12345678');
      await user.click(screen.getByRole('button', { name: /ok/i }));
      expect(ref.current.state.user).toEqual({
        email: 'user@example.com',
        password: '12345678',
        isLoggedIn: true,
      });
      expect(container.querySelector('#CourseList')).not.toBeNull();
      expect(screen.queryByText(/login to access the full dashboard/i)).toBeNull();
      expect(container.querySelector('#logoutSection')).toHaveTextContent('Welcome user@example.com (logout)');
      expect(screen.getByRole('link', { name: 'Contact us' })).toBeInTheDocument();
    });

    test('updates the UI when the user state changes', () => {
      const ref = createRef();
      const { container } = render(<App ref={ref} />);
      expect(container.querySelector('#logoutSection')).toBeNull();
      expect(container.querySelector('#CourseList')).toBeNull();

      setLoggedInState(ref);
      expect(container.querySelector('#logoutSection')).toHaveTextContent('Welcome user@example.com (logout)');
      expect(container.querySelector('#CourseList')).not.toBeNull();
      expect(screen.queryByLabelText(/email/i)).toBeNull();

      act(() => ref.current.setState({ user: { email: '', password: '', isLoggedIn: false } }));
      expect(container.querySelector('#logoutSection')).toBeNull();
      expect(container.querySelector('#CourseList')).toBeNull();
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });

    test('logs out from the Header logout link and renders Login again', async () => {
      const user = userEvent.setup();
      const ref = createRef();
      const { container } = render(<App ref={ref} />);
      setLoggedInState(ref);
      await user.click(screen.getByText('logout'));
      expect(ref.current.state.user).toEqual({ email: '', password: '', isLoggedIn: false });
      expect(container.querySelector('#logoutSection')).toBeNull();
      expect(container.querySelector('#CourseList')).toBeNull();
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/password/i)).toHaveValue('');
      expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled();
      expect(screen.queryByRole('link', { name: 'Contact us' })).not.toBeInTheDocument();
    });

    test('supports logging in again after logging out', async () => {
      const user = userEvent.setup();
      const { container } = render(<App />);
      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), '12345678');
      await user.click(screen.getByRole('button', { name: /ok/i }));
      await user.click(screen.getByText('logout'));
      await user.type(screen.getByLabelText(/email/i), 'second@example.com');
      await user.type(screen.getByLabelText(/password/i), 'abcdefgh');
      await user.click(screen.getByRole('button', { name: /ok/i }));
      expect(container.querySelector('#logoutSection')).toHaveTextContent('Welcome second@example.com (logout)');
      expect(container.querySelector('#CourseList')).not.toBeNull();
    });
  });

  describe('when control and h keys are pressed', () => {
    let alertSpy;

    beforeEach(() => {
      alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
      alertSpy.mockRestore();
    });

    test.each(['h', 'H'])('logs out the current user when Ctrl+%s is pressed', (key) => {
      const ref = createRef();
      const { container } = render(<App ref={ref} />);
      setLoggedInState(ref);
      fireEvent.keyDown(document, { ctrlKey: true, key });
      expect(ref.current.state.user).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      });
      expect(container.querySelector('#CourseList')).toBeNull();
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/password/i)).toHaveValue('');
      expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled();
    });

    test('does not log out when h is pressed without Ctrl', () => {
      const ref = createRef();
      render(<App ref={ref} />);
      setLoggedInState(ref);
      fireEvent.keyDown(document, { key: 'h' });
      expect(ref.current.state.user.isLoggedIn).toBe(true);
      expect(alertSpy).not.toHaveBeenCalled();
    });

    test('removes the keyboard handler when App unmounts', () => {
      const { unmount } = render(<App />);
      unmount();
      fireEvent.keyDown(document, { ctrlKey: true, key: 'h' });
      expect(alertSpy).not.toHaveBeenCalled();
    });

    describe('authentication context', () => {
      test('provides an empty default user and a no-op logOut', () => {
        let value;
        render(
          <newContext.Consumer>
            {(context) => {
              value = context;
              return null;
            }}
          </newContext.Consumer>
        );
        expect(value.user).toEqual({ email: '', password: '', isLoggedIn: false });
        expect(value.logOut()).toBeUndefined();
      });

      test('uses App state as the provider value without recreating it during render', () => {
        const ref = createRef();
        render(<App ref={ref} />);
        const firstRender = ref.current.render();
        expect(firstRender.type).toBe(newContext.Provider);
        expect(firstRender.props.value).toBe(ref.current.state);
        expect(ref.current.render().props.value).toBe(firstRender.props.value);
        expect(firstRender.props.value.user).toEqual({
          email: '',
          password: '',
          isLoggedIn: false,
        });
        expect(firstRender.props.value.logOut).toBe(ref.current.logOut);
      });

      test('updates context on login and resets credentials through its logOut function', () => {
        const ref = createRef();
        render(<App ref={ref} />);
        const originalValue = ref.current.render().props.value;
        setLoggedInState(ref);
        const loggedInValue = ref.current.render().props.value;
        expect(loggedInValue).not.toBe(originalValue);
        expect(loggedInValue.user).toEqual({
          email: 'user@example.com',
          password: '12345678',
          isLoggedIn: true,
        });
        expect(loggedInValue.logOut).toBe(originalValue.logOut);
        act(() => loggedInValue.logOut());
        expect(ref.current.state.user).toEqual(originalValue.user);
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
      });
    });

    test('calls alert function with the string Logging you out', () => {
      render(<App />);
      fireEvent.keyDown(document, { ctrlKey: true, key: 'h' });
      expect(alertSpy).toHaveBeenCalledWith('Logging you out');
    });
  });

  describe('notification and course state', () => {
    test('initializes notifications and courses in state', () => {
      const app = new App({});
      expect(app.state.notifications.map(({ id }) => id)).toEqual([1, 2, 3]);
      expect(app.state.courses).toEqual([
        { id: 1, name: 'ES6', credit: 60 },
        { id: 2, name: 'Webpack', credit: 20 },
        { id: 3, name: 'React', credit: 40 },
      ]);
    });

    test('renders courses from state', () => {
      const ref = createRef();
      render(<App ref={ref} />);
      act(() => ref.current.setState({
        user: loggedInUser,
        courses: [{ id: 4, name: 'State course', credit: 10 }],
      }));
      expect(screen.getByText('State course')).toBeInTheDocument();
      expect(screen.queryByText('ES6')).not.toBeInTheDocument();
    });

    test.each([1, 2, 3])('removes clicked notification %i from state and UI and logs its ID', (id) => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      try {
        const ref = createRef();
        const { container } = render(<App ref={ref} />);
        fireEvent.click(screen.getByText(/your notifications/i));
        const originalNotifications = ref.current.state.notifications;
        const originalCourses = ref.current.state.courses;
        consoleSpy.mockClear();
        fireEvent.click(screen.getAllByRole('listitem')[id - 1]);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(`Notification ${id} has been marked as read`);
        expect(ref.current.state.notifications.map((notification) => notification.id))
          .toEqual([1, 2, 3].filter((notificationId) => notificationId !== id));
        expect(ref.current.state.notifications).not.toBe(originalNotifications);
        expect(originalNotifications).toHaveLength(3);
        expect(ref.current.state.courses).toBe(originalCourses);
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(container.querySelector('.notification-items')).toBeInTheDocument();
      } finally {
        consoleSpy.mockRestore();
      }
    });

    test('shows the empty message after every notification is clicked', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      try {
        const ref = createRef();
        render(<App ref={ref} />);
        fireEvent.click(screen.getByText(/your notifications/i));
        screen.getAllByRole('listitem').forEach((item) => fireEvent.click(item));
        expect(ref.current.state.notifications).toEqual([]);
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
        expect(screen.getByText('No new notification for now')).toBeInTheDocument();
      } finally {
        consoleSpy.mockRestore();
      }
    });

    test('preserves consecutive notification removals in one state batch', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      try {
        const ref = createRef();
        render(<App ref={ref} />);
        act(() => {
          ref.current.markNotificationAsRead(1);
          ref.current.markNotificationAsRead(2);
        });
        expect(ref.current.state.notifications.map(({ id }) => id)).toEqual([3]);
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe('displayDrawer state and handlers', () => {
    test('default state for displayDrawer is false', () => {
      const app = new App({});
      expect(app.state.displayDrawer).toBe(false);
    });

    test('verify that after calling handleDisplayDrawer, the state should update to true', () => {
      const app = new App({});
      app.setState = jest.fn(function (newState) {
        this.state = { ...this.state, ...newState };
      });
      app.handleDisplayDrawer();
      expect(app.state.displayDrawer).toBe(true);
    });

    test('verify that after calling handleHideDrawer, the state should update to false', () => {
      const app = new App({});
      app.state.displayDrawer = true;
      app.setState = jest.fn(function (newState) {
        this.state = { ...this.state, ...newState };
      });
      app.handleHideDrawer();
      expect(app.state.displayDrawer).toBe(false);
    });

    test('notifications drawer is not displayed by default', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.notification-items')).toBeNull();
    });

    test('clicking on Your notifications opens the drawer', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.notification-items')).toBeNull();
      fireEvent.click(screen.getByText(/your notifications/i));
      expect(container.querySelector('.notification-items')).not.toBeNull();
    });

    test('clicking on close button closes the drawer', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByText(/your notifications/i));
      expect(container.querySelector('.notification-items')).not.toBeNull();
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(container.querySelector('.notification-items')).toBeNull();
    });

    test('keeps notifications working across login and logout', () => {
      const ref = createRef();
      const { container } = render(<App ref={ref} />);
      fireEvent.click(screen.getByText(/your notifications/i));
      setLoggedInState(ref);
      expect(container.querySelector('.notification-items')).not.toBeNull();
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(container.querySelector('.notification-items')).toBeNull();
      fireEvent.click(screen.getByText(/your notifications/i));
      act(() => ref.current.state.logOut());
      expect(container.querySelector('.notification-items')).not.toBeNull();
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(container.querySelector('.notification-items')).toBeNull();
    });
  });
});
