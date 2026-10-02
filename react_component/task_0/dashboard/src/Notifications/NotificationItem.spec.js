import { render, screen } from '@testing-library/react';
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

  test('li element has color blue and attribute data-notification-type set to default when type prop is "default"', () => {
    render(<NotificationItem type="default" value="test" />);
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveAttribute('data-notification-type', 'default');
    expect(listItem).toHaveStyle({ color: 'blue' });
  });

  test('li element has color red and attribute data-notification-type set to urgent when type prop is "urgent"', () => {
    render(<NotificationItem type="urgent" value="test" />);
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveAttribute('data-notification-type', 'urgent');
    expect(listItem).toHaveStyle({ color: 'red' });
  });
});
