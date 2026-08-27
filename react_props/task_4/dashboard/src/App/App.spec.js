import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App component', () => {
  test('renders App component without crashing', () => {
    render(<App />);
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
});
