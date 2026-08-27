import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './Notifications';
import { getLatestNotification } from '../utils/utils';

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
];

describe('Notifications component', () => {
  describe('when displayDrawer is false', () => {
    test('renders Your notifications text', () => {
      render(<Notifications displayDrawer={false} />);
      expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    });

    test('does not display close button, p element, or notification items', () => {
      const { container } = render(<Notifications displayDrawer={false} />);
      expect(container.querySelector('.notification-items')).toBeNull();
      expect(screen.queryByRole('button')).toBeNull();
      expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();
      expect(screen.queryByText(/no new notification for now/i)).toBeNull();
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
  });

  describe('when displayDrawer is true', () => {
    test('renders Your notifications text', () => {
      render(<Notifications displayDrawer={true} notifications={notificationsList} />);
      expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    });

    test('displays close button, p element, and notification items when notifications array is provided', () => {
      const { container } = render(<Notifications displayDrawer={true} notifications={notificationsList} />);
      expect(container.querySelector('.notification-items')).not.toBeNull();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(3);
    });

    test('displays No new notification for now when notifications array is empty', () => {
      const { container } = render(<Notifications displayDrawer={true} notifications={[]} />);
      expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
      expect(container.querySelector('.notification-items')).not.toBeNull();
      expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument();
      expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
  });

  test('logs Close button has been clicked to the console when close button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Notifications displayDrawer={true} notifications={notificationsList} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/close button has been clicked/i));
    consoleSpy.mockRestore();
  });
});
