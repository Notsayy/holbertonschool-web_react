import { render, screen } from '@testing-library/react'
import Footer from './Footer'
import newContext from '../Context/context'
import { getFooterCopy } from '../utils/utils'


const ContextProvider = newContext.Provider

const renderWithUser = (user) =>
  render(
    <ContextProvider value={{ user, logOut: () => {} }}>
      <Footer />
    </ContextProvider>
  )

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
    test('is not displayed with the default context value', () => {
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

    test('disappears once the user in the context logs out', () => {
      const { rerender } = renderWithUser({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })

      rerender(
        <ContextProvider
          value={{
            user: { email: '', password: '', isLoggedIn: false },
            logOut: () => {},
          }}
        >
          <Footer />
        </ContextProvider>
      )

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })
  })
})
