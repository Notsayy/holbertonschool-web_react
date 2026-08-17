import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  test('renders the h1 element with text School Dashboard', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', { level: 1, name: /school dashboard/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the text content within app-body and app-footer p elements', () => {
    render(<App />);
    const bodyText = screen.getByText(/login to access the full dashboard/i);
    const footerText = screen.getByText(/copyright.*holberton school/i);
    expect(bodyText).toBeInTheDocument();
    expect(footerText).toBeInTheDocument();
  });

  test('renders an img element', () => {
    render(<App />);
    const imageElement = screen.getByAltText(/holberton logo/i);
    expect(imageElement).toBeInTheDocument();
  });
});
