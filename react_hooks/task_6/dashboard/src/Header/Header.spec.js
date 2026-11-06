import { fireEvent, render, screen } from '@testing-library/react'
import Header from './Header'

const loggedInUser = {
  email: 'user@example.com',
  password: 'secret-password',
  isLoggedIn: true,
}

const renderLoggedIn = (logOut = () => {}) =>
  render(<Header user={loggedInUser} logOut={logOut} />)

describe('Header', () => {
  test('is a function component', () => {
    expect(typeof Header).toBe('function')
    expect(Header.prototype?.isReactComponent).toBeUndefined()
  })

  test('renders the Holberton logo', () => {
    const { container } = render(<Header />)
    const images = Array.from(container.querySelectorAll('img'))

    const logo = images.find((image) =>
      /holberton/i.test(`${image.getAttribute('alt')} ${image.getAttribute('src')}`)
    )

    expect(logo).toBeDefined()
    expect(logo).toBeInTheDocument()
  })

  test('renders an h1 with the text School dashboard', () => {
    render(<Header />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  describe('the logout section', () => {
    test('is not rendered with the default user prop', () => {
      const { container } = render(<Header />)

      expect(container.querySelector('#logoutSection')).toBeNull()
    })

    test('is rendered when the user prop is logged in', () => {
      const { container } = renderLoggedIn()
      const section = container.querySelector('#logoutSection')

      expect(section).toBeInTheDocument()
      expect(section).toHaveTextContent(/welcome user@example\.com/i)
      expect(screen.getByText(/welcome user@example\.com/i)).toBe(section)
      expect(screen.getByText(/^logout$/i)).toBeInTheDocument()
    })

    test('calls the logOut prop when logout is clicked', () => {
      const logOut = jest.fn()
      renderLoggedIn(logOut)

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(logOut).toHaveBeenCalledTimes(1)
    })

    test('disappears when the user prop changes to logged out', () => {
      const { rerender } = renderLoggedIn()

      rerender(<Header user={{ email: '', password: '', isLoggedIn: false }} />)

      expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /logout/i })).not.toBeInTheDocument()
    })
  })
})
