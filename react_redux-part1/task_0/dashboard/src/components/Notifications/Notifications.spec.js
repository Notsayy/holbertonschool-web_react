import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './Notifications';
import { getLatestNotification } from '../../utils/utils';

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

    test('renders the close button with img', () => {
      render(<Notifications displayDrawer={true} notifications={notificationsList} />);
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
      const closeImg = screen.getByAltText('close icon');
      expect(closeImg).toBeInTheDocument();
    });

    test('renders 3 NotificationItem components when notifications is provided', () => {
      render(<Notifications displayDrawer={true} notifications={notificationsList} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
    });

    test('renders the text Here is the list of notifications', () => {
      render(<Notifications displayDrawer={true} notifications={notificationsList} />);
      expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
    });

    test('renders the correct html for the first NotificationItem', () => {
      render(<Notifications displayDrawer={true} notifications={notificationsList} />);
      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('New course available');
      expect(items[0]).toHaveAttribute('data-notification-type', 'default');
    });

    test('renders No new notification for now when notifications is empty', () => {
      render(<Notifications displayDrawer={true} notifications={[]} />);
      expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument();
      expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();
    });

    test('renders No new notification for now when notifications is not passed', () => {
      render(<Notifications displayDrawer={true} />);
      expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument();
      expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();
    });
  });

  describe('markAsRead', () => {
    test('logs Notification {id} has been marked as read to console', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const instance = new Notifications({});
      instance.markAsRead(1);
      expect(consoleSpy).toHaveBeenCalledWith('Notification 1 has been marked as read');
      consoleSpy.mockRestore();
    });
  });

  describe('shouldComponentUpdate', () => {
    test('does not re-render when updating with the same list length and same displayDrawer', () => {
      const { rerender } = render(
        <Notifications displayDrawer={true} notifications={notificationsList} />
      );
      const renderSpy = jest.spyOn(Notifications.prototype, 'render');
      rerender(
        <Notifications displayDrawer={true} notifications={notificationsList} />
      );
      expect(renderSpy).not.toHaveBeenCalled();
      renderSpy.mockRestore();
    });

    test('re-renders when updating with a longer list', () => {
      const longerList = [
        ...notificationsList,
        { id: 4, type: 'default', value: 'Another course' },
      ];
      const { rerender } = render(
        <Notifications displayDrawer={true} notifications={notificationsList} />
      );
      const renderSpy = jest.spyOn(Notifications.prototype, 'render');
      rerender(
        <Notifications displayDrawer={true} notifications={longerList} />
      );
      expect(renderSpy).toHaveBeenCalledTimes(1);
      renderSpy.mockRestore();
    });

    test('re-renders when displayDrawer prop changes', () => {
      const { rerender } = render(
        <Notifications displayDrawer={false} notifications={notificationsList} />
      );
      const renderSpy = jest.spyOn(Notifications.prototype, 'render');
      rerender(
        <Notifications displayDrawer={true} notifications={notificationsList} />
      );
      expect(renderSpy).toHaveBeenCalledTimes(1);
      renderSpy.mockRestore();
    });
  });

  test('verify that clicking on the menu item calls handleDisplayDrawer', () => {
    const handleDisplayDrawer = jest.fn();
    render(<Notifications handleDisplayDrawer={handleDisplayDrawer} />);
    const menuItem = screen.getByText(/your notifications/i);
    fireEvent.click(menuItem);
    expect(handleDisplayDrawer).toHaveBeenCalledTimes(1);
  });

  test('verify that clicking on the close button calls handleHideDrawer', () => {
    const handleHideDrawer = jest.fn();
    render(
      <Notifications
        displayDrawer={true}
        notifications={notificationsList}
        handleHideDrawer={handleHideDrawer}
      />
    );
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(handleHideDrawer).toHaveBeenCalledTimes(1);
  });
});

