import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import useLogin from '../../hooks/useLogin';

describe('Login', () => {
  test('renders 2 label, 2 input and 1 button elements', () => {
    const { container } = render(<Login />);

    const labels = Array.from(container.querySelectorAll('label'));
    const inputs = Array.from(container.querySelectorAll('input')).filter(
      (input) => !['button', 'reset', 'submit'].includes(input.type)
    );

    expect(labels).toHaveLength(2);
    expect(labels.some((label) => /email/i.test(label.textContent))).toBe(true);
    expect(labels.some((label) => /password/i.test(label.textContent))).toBe(
      true
    );

    expect(inputs).toHaveLength(2);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument();
  });

  test('focuses the related input when a label is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Login />);

    const labels = Array.from(container.querySelectorAll('label'));
    const emailLabel = labels.find((label) => /email/i.test(label.textContent));
    const passwordLabel = labels.find((label) =>
      /password/i.test(label.textContent)
    );

    await user.click(emailLabel);
    expect(screen.getByLabelText(/email/i)).toHaveFocus();

    await user.click(passwordLabel);
    expect(screen.getByLabelText(/password/i)).toHaveFocus();
  });

  describe('the submit input', () => {
    const submit = () => screen.getByRole('button', { name: /^ok$/i });

    test('is disabled by default', () => {
      render(<Login />);

      expect(submit()).toBeDisabled();
    });

    test('is enabled only once both email and password are valid', async () => {
      const user = userEvent.setup();
      render(<Login />);
      const email = screen.getByLabelText(/email/i);
      const password = screen.getByLabelText(/password/i);

      await user.type(email, 'user@example.com');
      expect(submit()).toBeDisabled();

      await user.type(password, '12345678');
      expect(submit()).toBeEnabled();
    });

    test('is disabled again if email is cleared', async () => {
      const user = userEvent.setup();
      render(<Login />);
      const email = screen.getByLabelText(/email/i);
      const password = screen.getByLabelText(/password/i);

      await user.type(email, 'user@example.com');
      await user.type(password, '12345678');
      expect(submit()).toBeEnabled();

      await user.clear(email);
      expect(submit()).toBeDisabled();
    });

    test('is disabled again if password drops below 8 characters', async () => {
      const user = userEvent.setup();
      render(<Login />);
      const email = screen.getByLabelText(/email/i);
      const password = screen.getByLabelText(/password/i);

      await user.type(email, 'user@example.com');
      await user.type(password, '12345678');
      expect(submit()).toBeEnabled();

      await user.type(password, '{backspace}');
      expect(submit()).toBeDisabled();
    });
  });

  describe('the custom useLogin hook', () => {
    test('initializes email and password with empty strings and enableSubmit as false', () => {
      const { result } = renderHook(() => useLogin(jest.fn()));

      expect(result.current.email).toBe('');
      expect(result.current.password).toBe('');
      expect(result.current.enableSubmit).toBe(false);
    });

    test('updates the email and leaves the password untouched on change', () => {
      const { result } = renderHook(() => useLogin(jest.fn()));

      act(() => {
        result.current.handleChangeEmail({
          target: { value: 'user@example.com' },
        });
      });

      expect(result.current.email).toBe('user@example.com');
      expect(result.current.password).toBe('');
      expect(result.current.enableSubmit).toBe(false);
    });

    test('updates the password and leaves the email untouched on change', () => {
      const { result } = renderHook(() => useLogin(jest.fn()));

      act(() => {
        result.current.handleChangePassword({
          target: { value: '12345678' },
        });
      });

      expect(result.current.email).toBe('');
      expect(result.current.password).toBe('12345678');
      expect(result.current.enableSubmit).toBe(false);
    });

    test('turns enableSubmit to true once both email and password are valid', () => {
      const { result } = renderHook(() => useLogin(jest.fn()));

      act(() => {
        result.current.handleChangeEmail({
          target: { value: 'user@example.com' },
        });
        result.current.handleChangePassword({
          target: { value: '12345678' },
        });
      });

      expect(result.current.enableSubmit).toBe(true);
    });

    test('prevents form submission default and invokes the callback with credentials', () => {
      const onLogin = jest.fn();
      const preventDefault = jest.fn();
      const { result } = renderHook(() => useLogin(onLogin));

      act(() => {
        result.current.handleChangeEmail({
          target: { value: 'user@example.com' },
        });
        result.current.handleChangePassword({
          target: { value: '12345678' },
        });
      });

      act(() => {
        result.current.handleLoginSubmit({ preventDefault });
      });

      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(onLogin).toHaveBeenCalledWith('user@example.com', '12345678');
    });

    test('does not invoke the callback when submitted while invalid', () => {
      const onLogin = jest.fn();
      const preventDefault = jest.fn();
      const { result } = renderHook(() => useLogin(onLogin));

      act(() => {
        result.current.handleLoginSubmit({ preventDefault });
      });

      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(onLogin).not.toHaveBeenCalled();
    });
  });

  describe('form submission via the UI', () => {
    test('submits with the typed values when clicking OK', async () => {
      const user = userEvent.setup();
      const logIn = jest.fn();
      render(<Login logIn={logIn} />);

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), '12345678');
      await user.click(screen.getByRole('button', { name: /^ok$/i }));

      expect(logIn).toHaveBeenCalledTimes(1);
      expect(logIn).toHaveBeenCalledWith('user@example.com', '12345678');
    });

    test('submits with the typed values on Enter press in password', async () => {
      const user = userEvent.setup();
      const logIn = jest.fn();
      render(<Login logIn={logIn} />);

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), '12345678{enter}');

      expect(logIn).toHaveBeenCalledTimes(1);
      expect(logIn).toHaveBeenCalledWith('user@example.com', '12345678');
    });

    test('does not invoke logIn if the form is submitted via DOM dispatch while disabled', () => {
      const logIn = jest.fn();
      const { container } = render(<Login logIn={logIn} />);

      fireEvent.submit(container.querySelector('form'));

      expect(logIn).not.toHaveBeenCalled();
    });
  });
});
