import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'
import useLogin from '../hooks/useLogin'

describe('Login', () => {
  test('renders 2 label, 2 input and 1 button elements', () => {
    const { container } = render(<Login />)

    const labels = Array.from(container.querySelectorAll('label'))
    const inputs = Array.from(container.querySelectorAll('input')).filter(
      (input) => !['button', 'reset', 'submit'].includes(input.type)
    )

    expect(labels).toHaveLength(2)
    expect(labels.some((label) => /email/i.test(label.textContent))).toBe(true)
    expect(labels.some((label) => /password/i.test(label.textContent))).toBe(
      true
    )

    expect(inputs).toHaveLength(2)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
  })

  test('focuses the related input when a label is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<Login />)

    const labels = Array.from(container.querySelectorAll('label'))
    const emailLabel = labels.find((label) => /email/i.test(label.textContent))
    const passwordLabel = labels.find((label) =>
      /password/i.test(label.textContent)
    )

    await user.click(emailLabel)
    expect(screen.getByLabelText(/email/i)).toHaveFocus()

    await user.click(passwordLabel)
    expect(screen.getByLabelText(/password/i)).toHaveFocus()
  })

  describe('the submit input', () => {
    const submit = () => screen.getByRole('button', { name: /^ok$/i })

    test('is disabled by default', () => {
      render(<Login />)

      expect(submit()).toBeDisabled()
    })

    test('is enabled only once both email and password are valid', async () => {
      const user = userEvent.setup()
      render(<Login />)
      const email = screen.getByLabelText(/email/i)
      const password = screen.getByLabelText(/password/i)

      await user.type(email, 'user@example.com')
      expect(submit()).toBeDisabled()

      await user.type(password, '1234567')
      expect(submit()).toBeDisabled()

      await user.type(password, '8')
      expect(submit()).toBeEnabled()

      await user.clear(email)
      await user.type(email, 'not-an-email')
      expect(submit()).toBeDisabled()
    })

    test('keeps the inputs in sync with what the user types', async () => {
      const user = userEvent.setup()
      render(<Login />)

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')

      expect(screen.getByLabelText(/email/i)).toHaveValue('user@example.com')
      expect(screen.getByLabelText(/password/i)).toHaveValue('secret-password')
    })

    test('does not reload the page when the form is submitted', async () => {
      const user = userEvent.setup()
      const { container } = render(<Login />)
      const form = container.querySelector('form')
      const onSubmit = jest.fn((event) => event.defaultPrevented)
      document.addEventListener('submit', onSubmit)

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(submit())

      expect(form).toBeInTheDocument()
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.results[0].value).toBe(true)

      document.removeEventListener('submit', onSubmit)
    })
  })

  describe('the logIn prop', () => {
    test.each([
      ['', ''],
      ['invalid-email', '12345678'],
      ['user@example.com', 'short'],
    ])('rejects direct submissions with invalid credentials: %s / %s', (email, password) => {
      const logIn = jest.fn()
      const { container } = render(<Login logIn={logIn} />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: email },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: password },
      })
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled()

      expect(fireEvent.submit(container.querySelector('form'))).toBe(false)

      expect(logIn).not.toHaveBeenCalled()
    })

    describe('useLogin', () => {
      test('starts empty and disabled', () => {
        const { result } = renderHook(() => useLogin(jest.fn()))

        expect(result.current).toEqual({
          email: '',
          password: '',
          enableSubmit: false,
          handleChangeEmail: expect.any(Function),
          handleChangePassword: expect.any(Function),
          handleLoginSubmit: expect.any(Function),
        })
      })

      test('preserves both fields when their changes are batched', () => {
        const { result } = renderHook(() => useLogin(jest.fn()))

        act(() => {
          result.current.handleChangeEmail({ target: { value: 'user@example.com' } })
          result.current.handleChangePassword({ target: { value: '12345678' } })
        })

        expect(result.current.email).toBe('user@example.com')
        expect(result.current.password).toBe('12345678')
        expect(result.current.enableSubmit).toBe(true)

        act(() => {
          result.current.handleChangePassword({ target: { value: '1234567' } })
        })

        expect(result.current.email).toBe('user@example.com')
        expect(result.current.enableSubmit).toBe(false)
      })

      test.each(['', 'user', 'user@example', 'user name@example.com', '@example.com'])(
        'rejects invalid email %s even with a valid password',
        (email) => {
          const onLogin = jest.fn()
          const { result } = renderHook(() => useLogin(onLogin))
          act(() => {
            result.current.handleChangeEmail({ target: { value: email } })
            result.current.handleChangePassword({ target: { value: '12345678' } })
          })
          const event = { preventDefault: jest.fn() }

          act(() => result.current.handleLoginSubmit(event))

          expect(result.current.enableSubmit).toBe(false)
          expect(event.preventDefault).toHaveBeenCalledTimes(1)
          expect(onLogin).not.toHaveBeenCalled()
        }
      )

      test('uses the latest callback and credentials when submitting a valid form', () => {
        const firstCallback = jest.fn()
        const onLogin = jest.fn()
        const { result, rerender } = renderHook(({ callback }) => useLogin(callback), {
          initialProps: { callback: firstCallback },
        })
        act(() => {
          result.current.handleChangePassword({ target: { value: '12345678' } })
          result.current.handleChangeEmail({ target: { value: 'user@example.com' } })
        })
        rerender({ callback: onLogin })
        const event = { preventDefault: jest.fn() }

        act(() => result.current.handleLoginSubmit(event))

        expect(result.current.enableSubmit).toBe(true)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
        expect(firstCallback).not.toHaveBeenCalled()
        expect(onLogin).toHaveBeenCalledTimes(1)
        expect(onLogin).toHaveBeenCalledWith('user@example.com', '12345678')
      })
    })

    test('is called with the email and password when the form is submitted', async () => {
      const user = userEvent.setup()
      const logIn = jest.fn()
      render(<Login logIn={logIn} />)

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      expect(logIn).toHaveBeenCalledTimes(1)
      expect(logIn).toHaveBeenCalledWith('user@example.com', 'secret-password')
    })

    test('is not called while the submit input is disabled', async () => {
      const user = userEvent.setup()
      const logIn = jest.fn()
      render(<Login logIn={logIn} />)

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'short')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      expect(logIn).not.toHaveBeenCalled()
    })

    test('is called with the values typed last, after a correction', async () => {
      const user = userEvent.setup()
      const logIn = jest.fn()
      render(<Login logIn={logIn} />)
      const email = screen.getByLabelText(/email/i)

      await user.type(email, 'first@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.clear(email)
      await user.type(email, 'second@example.com')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      expect(logIn).toHaveBeenCalledWith('second@example.com', 'secret-password')
    })
  })

  describe('as a function component', () => {
    test('starts with empty inputs, whatever the props', () => {
      render(<Login email="user@example.com" password="secret-password" />)

      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/password/i)).toHaveValue('')
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled()
    })

    test('is still wrapped by WithLogging', () => {
      expect(Login.displayName).toMatch(/WithLogging\(Login\)/)
    })
  })
})
