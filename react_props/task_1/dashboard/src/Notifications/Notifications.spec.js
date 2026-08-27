import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './Notifications';

describe('Notifications component', () => {
  test('renders the notifications title Here is the list of notifications', () => {
    render(<Notifications />);
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
  });

  test('renders the button element in the notifications', () => {
    render(<Notifications />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders 3 li elements as notifications', () => {
    const { container } = render(<Notifications />);
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
  });

  test('logs Close button has been clicked to the console when close button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Notifications />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/close button has been clicked/i));
    consoleSpy.mockRestore();
  });
});
