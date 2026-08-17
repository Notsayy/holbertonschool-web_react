import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App component', () => {
  test('renders the h1 element with text School Dashboard', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', { level: 1, name: /school dashboard/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the text content within app-body and app-footer p elements', () => {
    render(<App />);
    const bodyText = screen.getByText(/login to access the full dashboard/i);
    const footerText = screen.getByText(/copyright.*holberton school/i);
    expect(bodyText).toBeInTheDocument();
    expect(footerText).toBeInTheDocument();
  });

  test('renders an img element', () => {
    render(<App />);
    const imageElement = screen.getByAltText(/holberton logo/i);
    expect(imageElement).toBeInTheDocument();
  });

  test('renders email and password inputs with labels and OK button', () => {
    render(<App />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
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
