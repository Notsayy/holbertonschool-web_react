import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './Notifications';

describe('Notifications component', () => {
  test('renders the notifications text', () => {
    render(<Notifications />);
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
  });

  test('renders 3 list items', () => {
    const { container } = render(<Notifications />);
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
  });

  test('renders correct notification text and priority data attributes', () => {
    render(<Notifications />);
    expect(screen.getByText(/new course available/i)).toHaveAttribute('data-priority', 'default');
    expect(screen.getByText(/new resume available/i)).toHaveAttribute('data-priority', 'urgent');
    expect(screen.getByText(/urgent requirement/i).closest('li')).toHaveAttribute('data-priority', 'urgent');
  });

  test('logs to console when close button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Notifications />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(consoleSpy).toHaveBeenCalledWith('Close button has been clicked');
    consoleSpy.mockRestore();
  });
});
