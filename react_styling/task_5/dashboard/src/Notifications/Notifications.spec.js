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

    test('applies animate-bounce class when notifications length > 0 and displayDrawer is false', () => {
      render(<Notifications displayDrawer={false} notifications={notificationsList} />);
      const title = screen.getByText(/your notifications/i);
      expect(title).toHaveClass('animate-bounce');
    });

    test('does not apply animate-bounce class when notifications length is 0 and displayDrawer is false', () => {
      render(<Notifications displayDrawer={false} notifications={[]} />);
      const title = screen.getByText(/your notifications/i);
      expect(title).not.toHaveClass('animate-bounce');
    });
  });

  describe('when displayDrawer is true', () => {
    test('renders Your notifications text', () => {
      render(<Notifications displayDrawer={true} notifications={notificationsList} />);
      expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    });

    test('does not apply animate-bounce class when displayDrawer is true', () => {
      render(<Notifications displayDrawer={true} notifications={notificationsList} />);
      const title = screen.getByText(/your notifications/i);
      expect(title).not.toHaveClass('animate-bounce');
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

  test('logs Notification {id} has been marked as read when clicking on a notification item', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Notifications displayDrawer={true} notifications={notificationsList} />);
    const listItems = screen.getAllByRole('listitem');
    fireEvent.click(listItems[0]);
    expect(consoleSpy).toHaveBeenCalledWith('Notification 1 has been marked as read');
    consoleSpy.mockRestore();
  });

  test('does not re-render when the length of the notifications prop stays the same', () => {
    const sameLength = [
      { id: 1, type: 'default', value: 'New course available' },
      { id: 2, type: 'urgent', value: 'New resume available' },
      { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
    ];
    const { rerender, getAllByRole } = render(
      <Notifications displayDrawer={true} notifications={notificationsList} />
    );
    const itemsBefore = getAllByRole('listitem').length;

    rerender(
      <Notifications
        displayDrawer={true}
        notifications={[
          { id: 1, type: 'urgent', value: 'Changed value 1' },
          { id: 2, type: 'default', value: 'Changed value 2' },
          { id: 3, type: 'default', value: 'Changed value 3' },
        ]}
      />
    );

    const itemsAfter = getAllByRole('listitem').length;
    expect(itemsAfter).toBe(itemsBefore);
  });

  test('re-renders when the length of the notifications prop changes', () => {
    const { rerender, getAllByRole } = render(
      <Notifications displayDrawer={true} notifications={notificationsList} />
    );
    expect(getAllByRole('listitem').length).toBe(3);

    rerender(
      <Notifications
        displayDrawer={true}
        notifications={[
          { id: 1, type: 'default', value: 'New course available' },
          { id: 2, type: 'urgent', value: 'New resume available' },
        ]}
      />
    );

    expect(getAllByRole('listitem').length).toBe(2);
  });
});
