import { render, screen } from '@testing-library/react';
import Header from './Header';

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
});
