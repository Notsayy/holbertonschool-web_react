import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header component', () => {
  test('renders Header component without crashing', () => {
    render(<Header />);
  });

  test('renders img and h1 tags', () => {
    render(<Header />);
    expect(screen.getByAltText('holberton logo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /school dashboard/i })).toBeInTheDocument();
  });
});
