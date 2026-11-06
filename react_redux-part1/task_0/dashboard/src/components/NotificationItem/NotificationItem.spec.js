import { render, screen, fireEvent } from '@testing-library/react';
import NotificationItem from './NotificationItem';

describe('NotificationItem component', () => {
  test('renders NotificationItem component without crashing', () => {
    render(<NotificationItem />);
  });

  test('renders correct html with dummy type and value props', () => {
    render(<NotificationItem type="default" value="test" />);
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveTextContent('test');
    expect(listItem).toHaveAttribute('data-notification-type', 'default');
  });

  test('renders correct html with dummy html prop', () => {
    render(<NotificationItem html={{ __html: '<u>test</u>' }} />);
    const listItem = screen.getByRole('listitem');
    expect(listItem.innerHTML).toBe('<u>test</u>');
  });

  test('calls markAsRead prop when click event is triggered', () => {
    const markAsReadSpy = jest.fn();
    render(<NotificationItem id={1} markAsRead={markAsReadSpy} value="test" />);
    const listItem = screen.getByRole('listitem');
    fireEvent.click(listItem);
    expect(markAsReadSpy).toHaveBeenCalledWith(1);
  });
});

