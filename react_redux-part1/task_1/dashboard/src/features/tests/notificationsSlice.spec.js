import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import notificationsReducer, {
  fetchNotifications,
  hideDrawer,
  markNotificationAsRead,
  showDrawer,
} from '../notifications/notificationsSlice';
import { getLatestNotification } from '../../utils/utils';

const notificationsUrl = 'http://localhost:5173/notifications.json';
const initialState = { notifications: [], displayDrawer: true };

afterEach(() => {
  mockAxios.reset();
  jest.restoreAllMocks();
});

describe('notificationsSlice', () => {
  test('returns the initial state by default', () => {
    expect(notificationsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('fetches notifications and updates the markup for id 3', async () => {
    const store = configureStore({ reducer: notificationsReducer });
    const notifications = [
      { id: 1, type: 'default', value: 'New course' },
      { id: 3, type: 'urgent', html: { __html: '' }, extra: 'preserved' },
    ];

    const request = store.dispatch(fetchNotifications());
    expect(mockAxios.get).toHaveBeenCalledWith(notificationsUrl);
    mockAxios.mockResponseFor({ url: notificationsUrl }, { data: { notifications } });
    const action = await request;

    expect(fetchNotifications.fulfilled.match(action)).toBe(true);
    expect(store.getState()).toEqual({
      displayDrawer: true,
      notifications: [
        notifications[0],
        { ...notifications[1], html: { __html: getLatestNotification() } },
      ],
    });
    expect(notifications[1].html).toEqual({ __html: '' });
  });

  test('does not add notification 3 when it is absent from the response', async () => {
    const store = configureStore({ reducer: notificationsReducer });
    const notifications = [{ id: 1, type: 'default', value: 'New course' }];

    const request = store.dispatch(fetchNotifications());
    mockAxios.mockResponseFor({ url: notificationsUrl }, { data: { notifications } });
    await request;

    expect(store.getState().notifications).toEqual(notifications);
  });

  test('rejects a failed request without replacing the existing notifications', async () => {
    const notifications = [{ id: 1, type: 'default', value: 'New course' }];
    const store = configureStore({
      reducer: notificationsReducer,
      preloadedState: { notifications, displayDrawer: false },
    });

    const request = store.dispatch(fetchNotifications());
    mockAxios.mockError(new Error('Network Error'));
    const action = await request;

    expect(fetchNotifications.rejected.match(action)).toBe(true);
    expect(action.error.message).toBe('Network Error');
    expect(store.getState()).toEqual({ notifications, displayDrawer: false });
  });

  test('removes only the requested notification and logs its id', () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    const previousState = {
      notifications: [{ id: 1 }, { id: 2 }],
      displayDrawer: true,
    };

    expect(notificationsReducer(previousState, markNotificationAsRead(1))).toEqual({
      notifications: [{ id: 2 }],
      displayDrawer: true,
    });
    expect(previousState.notifications).toEqual([{ id: 1 }, { id: 2 }]);
    expect(log).toHaveBeenCalledWith('Notification 1 has been marked as read');
  });

  test('shows and hides the drawer without toggling it accidentally', () => {
    const hidden = notificationsReducer(initialState, hideDrawer());
    expect(hidden.displayDrawer).toBe(false);
    expect(notificationsReducer(hidden, hideDrawer()).displayDrawer).toBe(false);

    const shown = notificationsReducer(hidden, showDrawer());
    expect(shown.displayDrawer).toBe(true);
    expect(notificationsReducer(shown, showDrawer()).displayDrawer).toBe(true);
  });
});
