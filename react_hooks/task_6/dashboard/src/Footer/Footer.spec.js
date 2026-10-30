import { render, screen } from '@testing-library/react'
import Footer from './Footer'
import { getFooterCopy } from '../utils/utils'

const renderWithUser = (user) =>
  render(<Footer user={user} />)

describe('Footer', () => {
  test('getFooterCopy returns the index copy when isIndex is true', () => {
    expect(getFooterCopy(true)).toMatch(/^holberton school$/i)
  })

  test('renders a p element with the copyright, the current year and the dashboard copy', () => {
    const { container } = render(<Footer />)
    const paragraph = container.querySelector('p')

    expect(paragraph).toBeInTheDocument()
    expect(paragraph.textContent.trim()).toMatch(
      /^copyright\s+\d{4}\s*-\s*holberton school main dashboard$/i
    )
  })

  describe('the Contact us link', () => {
    test('is not displayed with the default user prop', () => {
      render(<Footer />)

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })

    test('is not displayed when the user is logged out', () => {
      renderWithUser({ email: '', password: '', isLoggedIn: false })

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })

    test('is displayed when the user is logged in', () => {
      renderWithUser({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })

      const link = screen.getByRole('link', { name: /contact us/i })
      expect(link).toBeInTheDocument()
      expect(link.closest('p')).toBeInTheDocument()
    })

    test('disappears once the user prop changes to logged out', () => {
      const { rerender } = renderWithUser({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })

      rerender(
        <Footer user={{ email: '', password: '', isLoggedIn: false }} />
      )

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })
  })
})
