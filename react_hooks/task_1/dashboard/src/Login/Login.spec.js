import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

jest.mock('../HOC/WithLogging', () => ({
  __esModule: true,
  default: (Component) => Component,
}));

describe('Login component', () => {
  test('renders Login component without crashing', () => {
    render(<Login />);
  });

  test('renders a form with 2 labels, 2 fields, and 1 submit input', () => {
    const { container } = render(<Login />);
    const labels = container.querySelectorAll('label');
    const inputs = container.querySelectorAll('input:not([type="submit"])');
    const buttons = container.querySelectorAll('input[type="submit"]');
    expect(container.querySelector('form')).toBeInTheDocument();
    expect(labels.length).toBe(2);
    expect(inputs.length).toBe(2);
    expect(buttons.length).toBe(1);
  });

  test('initializes controlled fields with empty values and disables submit', () => {
    render(<Login email="user@example.com" password="12345678" />);
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled();
  });

  test('disables submit by default with empty controlled fields', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled();
  });

  test.each([
    ['', '12345678'],
    ['user@example.com', ''],
    ['user@example.com', '1234567'],
    ['invalid', '12345678'],
    ['user@example', '12345678'],
    ['user@@example.com', '12345678'],
    ['user name@example.com', '12345678'],
  ])('keeps submit disabled for email %j and password %j', (email, password) => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: password } });
    expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled();
  });

  test.each(['email', 'password'])('enables submit when valid, with %s entered last', async (lastField) => {
    const user = userEvent.setup();
    render(<Login />);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    const submit = screen.getByRole('button', { name: /ok/i });
    if (lastField === 'email') {
      await user.type(password, '12345678');
      expect(submit).toBeDisabled();
      await user.type(email, 'user@example.com');
    } else {
      await user.type(email, 'user@example.com');
      expect(submit).toBeDisabled();
      await user.type(password, '12345678');
    }
    expect(email).toHaveValue('user@example.com');
    expect(password).toHaveValue('12345678');
    expect(submit).toBeEnabled();
  });

  test.each([
    ['email', 'invalid'],
    ['email', ''],
    ['password', '1234567'],
    ['password', ''],
  ])('disables submit again when %s becomes %j', (field, value) => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '12345678' } });
    expect(screen.getByRole('button', { name: /ok/i })).toBeEnabled();
    fireEvent.change(screen.getByLabelText(new RegExp(field, 'i')), { target: { value } });
    expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled();
  });

  test('prevents page reload on submission', async () => {
    const user = userEvent.setup();
    const logIn = jest.fn();
    const { container } = render(<Login logIn={logIn} />);
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345678');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    fireEvent(container.querySelector('form'), submitEvent);
    expect(submitEvent.defaultPrevented).toBe(true);
    expect(logIn).toHaveBeenCalledTimes(1);
    expect(logIn).toHaveBeenCalledWith('user@example.com', '12345678');
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
  });

  test('does not log in when an invalid form is submitted directly', () => {
    const logIn = jest.fn();
    const { container } = render(<Login logIn={logIn} />);
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    fireEvent(container.querySelector('form'), submitEvent);
    expect(submitEvent.defaultPrevented).toBe(true);
    expect(logIn).not.toHaveBeenCalled();
  });

  test('calls the logIn prop with current credentials when submit is clicked', async () => {
    const user = userEvent.setup();
    const logIn = jest.fn();
    render(<Login logIn={logIn} />);
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345678');
    await user.click(screen.getByRole('button', { name: /ok/i }));
    expect(logIn).toHaveBeenCalledTimes(1);
    expect(logIn).toHaveBeenCalledWith('user@example.com', '12345678');
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
