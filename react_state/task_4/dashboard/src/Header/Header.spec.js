import { fireEvent, render, screen } from '@testing-library/react';
import Header from './Header';
import newContext from '../Context/context';

const renderWithUser = (logOut = jest.fn()) => {
  const value = {
    user: {
      email: 'user@example.com',
      password: '12345678',
      isLoggedIn: true,
    },
    logOut,
  };
  return render(
    <newContext.Provider value={value}>
      <Header />
    </newContext.Provider>
  );
};

describe('Header component', () => {
  test('renders Header component without crashing', () => {
    render(<Header />);
  });

  test('renders the Holberton logo', () => {
    render(<Header />);
    const imgElement = screen.getByAltText('holberton logo');
    expect(imgElement).toBeInTheDocument();
  });

  test('renders the heading h1 element with the correct text', () => {
    render(<Header />);
    const headingElement = screen.getByRole('heading', { level: 1, name: /school dashboard/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('does not render logoutSection with the default context', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('#logoutSection')).toBeNull();
  });

  test('renders logoutSection when the context user is logged in', () => {
    const { container } = renderWithUser();
    const section = container.querySelector('#logoutSection');
    expect(section).toBeInTheDocument();
    expect(section).toHaveTextContent('Welcome user@example.com (logout)');
  });

  test('calls the context logOut spy when logout is clicked', () => {
    const logOut = jest.fn();
    renderWithUser(logOut);
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    fireEvent(screen.getByText('logout'), clickEvent);
    expect(logOut).toHaveBeenCalledTimes(1);
    expect(clickEvent.defaultPrevented).toBe(true);
  });
});
