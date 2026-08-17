import { render, screen } from '@testing-library/react';
import Notifications from './Notifications';

describe('Notifications component', () => {
  test('renders the notifications text', () => {
    render(<Notifications />);
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
  });
});
