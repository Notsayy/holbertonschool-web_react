import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { getCurrentYear } from '../utils/utils';
import newContext from '../Context/context';

describe('Footer component', () => {
  test('renders Footer component without crashing', () => {
    render(<Footer />);
  });

  test('renders the string Copyright {the current year} - Holberton School', () => {
    render(<Footer />);
    const expectedText = `Copyright ${getCurrentYear()} - Holberton School`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  test('does not display Contact us with the default context', () => {
    render(<Footer />);
    expect(screen.queryByRole('link', { name: 'Contact us' })).not.toBeInTheDocument();
  });

  test.each([null, { email: '', password: '', isLoggedIn: false }])(
    'does not display Contact us for a missing or logged-out user: %j',
    (user) => {
      const value = { user, logOut: jest.fn() };
      render(<newContext.Provider value={value}><Footer /></newContext.Provider>);
      expect(screen.queryByRole('link', { name: 'Contact us' })).not.toBeInTheDocument();
    }
  );

  test('displays Contact us when logged in without adding another logout link', () => {
    const loggedInValue = {
      user: { email: 'user@example.com', password: '12345678', isLoggedIn: true },
      logOut: jest.fn(),
    };
    render(<newContext.Provider value={loggedInValue}><Footer /></newContext.Provider>);
    expect(screen.getByRole('link', { name: 'Contact us' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'logout' })).not.toBeInTheDocument();
  });
});
