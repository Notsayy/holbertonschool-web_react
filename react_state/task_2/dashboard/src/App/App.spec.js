import { createRef } from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import newContext from '../Context/context';

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

  describe('when isLoggedIn is false', () => {
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

  describe('when isLoggedIn is true', () => {
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
      act(() => ref.current.logIn('user@example.com', '12345678'));
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
      act(() => ref.current.logIn('user@example.com', '12345678'));
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
        act(() => ref.current.logIn('user@example.com', '12345678'));
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
      act(() => ref.current.logIn('user@example.com', '12345678'));
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
