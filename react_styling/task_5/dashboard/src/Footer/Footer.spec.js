import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { getCurrentYear } from '../utils/utils';

describe('Footer component', () => {
  test('renders Footer component without crashing', () => {
    render(<Footer />);
  });

  test('renders the string Copyright {the current year} - Holberton School', () => {
    render(<Footer />);
    const expectedText = `Copyright ${getCurrentYear()} - Holberton School`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
