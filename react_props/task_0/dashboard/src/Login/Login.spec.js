import { render, screen } from '@testing-library/react';
import Login from './Login';

describe('Login component', () => {
  test('renders Login component without crashing', () => {
    render(<Login />);
  });

  test('renders 2 input elements and 2 label elements', () => {
    const { container } = render(<Login />);
    const inputs = container.querySelectorAll('input');
    const labels = container.querySelectorAll('label');
    expect(inputs.length).toBe(2);
    expect(labels.length).toBe(2);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
