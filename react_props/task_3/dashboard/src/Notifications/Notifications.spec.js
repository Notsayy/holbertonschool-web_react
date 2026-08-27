import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './Notifications';
import { getLatestNotification } from '../utils/utils';

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
];

describe('Notifications component', () => {
  test('renders Notifications component without crashing', () => {
    render(<Notifications notifications={notificationsList} />);
  });

  test('renders the notifications title Here is the list of notifications', () => {
    render(<Notifications notifications={notificationsList} />);
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
  });

  test('renders the button element in the notifications', () => {
    render(<Notifications notifications={notificationsList} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders 3 notification items with appropriate text through notifications prop', () => {
    render(<Notifications notifications={notificationsList} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(3);
    expect(screen.getByText('New course available')).toBeInTheDocument();
    expect(screen.getByText('New resume available')).toBeInTheDocument();
    expect(screen.getByText(/Urgent requirement/i)).toBeInTheDocument();
  });

  test('logs Close button has been clicked to the console when close button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Notifications notifications={notificationsList} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/close button has been clicked/i));
    consoleSpy.mockRestore();
  });
});
