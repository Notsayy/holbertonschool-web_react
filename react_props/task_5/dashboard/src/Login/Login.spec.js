import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

describe('Login component', () => {
  test('renders Login component without crashing', () => {
    render(<Login />);
  });

  test('renders 2 label, 2 input, and 1 button elements', () => {
    const { container } = render(<Login />);
    const labels = container.querySelectorAll('label');
    const inputs = container.querySelectorAll('input');
    const buttons = container.querySelectorAll('button');
    expect(labels.length).toBe(2);
    expect(inputs.length).toBe(2);
    expect(buttons.length).toBe(1);
  });

  test('focuses input element when related label is clicked', async () => {
    render(<Login />);
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
