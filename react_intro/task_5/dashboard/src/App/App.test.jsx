import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
  render(<App />);
  expect(screen.getByAltText('holberton logo')).toBeInTheDocument();
  expect(screen.getByText('School dashboard')).toBeInTheDocument();
  expect(screen.getByText('Login to access the full dashboard')).toBeInTheDocument();
});
