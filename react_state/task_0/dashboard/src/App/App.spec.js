import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

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
      const { container } = render(<App isLoggedIn={false} />);
      expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
      expect(container.querySelector('#CourseList')).toBeNull();
    });

    test('renders the h1 element with text School Dashboard', () => {
      render(<App isLoggedIn={false} />);
      const headingElement = screen.getByRole('heading', { level: 1, name: /school dashboard/i });
      expect(headingElement).toBeInTheDocument();
    });

    test('renders 2 input elements (one for email and the other for password)', () => {
      const { container } = render(<App isLoggedIn={false} />);
      const inputs = container.querySelectorAll('input');
      expect(inputs.length).toBe(2);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('renders 2 label elements with the text Email and Password', () => {
      const { container } = render(<App isLoggedIn={false} />);
      const labels = container.querySelectorAll('label');
      expect(labels.length).toBe(2);
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/password/i)).toBeInTheDocument();
    });

    test('renders a button with the text OK', () => {
      render(<App isLoggedIn={false} />);
      expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
    });

    test('focuses the corresponding input field when clicking on a label element', async () => {
      render(<App isLoggedIn={false} />);
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
    test('renders CourseList component and does not render Login', () => {
      const { container } = render(<App isLoggedIn={true} />);
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

    test('calls logOut function passed as a prop once', () => {
      const logOutMock = jest.fn();
      render(<App logOut={logOutMock} />);
      fireEvent.keyDown(document, { ctrlKey: true, key: 'h' });
      expect(logOutMock).toHaveBeenCalledTimes(1);
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
  });
});
