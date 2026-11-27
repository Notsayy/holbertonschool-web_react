import { act, fireEvent, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import mockAxios from "jest-mock-axios";
import Notifications from "./Notifications";
import notificationsReducer, {
  fetchNotifications,
  hideDrawer,
} from "../../features/notifications/notificationsSlice";

const notifications = [
  { id: 1, type: "default", value: "New course available" },
  { id: 2, type: "urgent", value: "New resume available" },
  { id: 3, type: "urgent", html: { __html: "<strong>Urgent requirement</strong>" } },
];

const renderNotifications = (state) => {
  const store = configureStore({
    reducer: { notifications: notificationsReducer },
    preloadedState: { notifications: state },
  });
  render(
    <Provider store={store}>
      <Notifications />
    </Provider>
  );
  return store;
};

test("renders notifications from the store, including HTML", () => {
  renderNotifications({ notifications, displayDrawer: true });

  expect(screen.getByText("Your notifications")).toBeInTheDocument();
  expect(screen.getByText("Here is the list of notifications")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getByText("Urgent requirement").tagName).toBe("STRONG");
});

test("shows, hides, and reopens the drawer using Redux actions", () => {
  const store = renderNotifications({ notifications, displayDrawer: false });

  expect(screen.queryByText("Here is the list of notifications")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Your notifications"));
  expect(store.getState().notifications.displayDrawer).toBe(true);
  expect(screen.getAllByRole("listitem")).toHaveLength(3);

  fireEvent.click(screen.getByText("Your notifications"));
  expect(store.getState().notifications.displayDrawer).toBe(true);

  fireEvent.click(screen.getByRole("button", { name: /close/i }));
  expect(store.getState().notifications.displayDrawer).toBe(false);
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();

  fireEvent.click(screen.getByText("Your notifications"));
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

test("removes the clicked notification by id without removing others", () => {
  const log = jest.spyOn(console, "log").mockImplementation(() => {});
  const store = renderNotifications({ notifications, displayDrawer: true });

  fireEvent.click(screen.getByText("New resume available"));

  expect(store.getState().notifications.notifications).toEqual([notifications[0], notifications[2]]);
  expect(screen.queryByText("New resume available")).not.toBeInTheDocument();
  expect(screen.getByText("New course available")).toBeInTheDocument();
  expect(screen.getByText("Urgent requirement")).toBeInTheDocument();
  expect(log).toHaveBeenCalledWith("Notification 2 has been marked as read");
  log.mockRestore();
});

test("renders fetched notifications and reacts to store updates", async () => {
  const store = renderNotifications({ notifications: [], displayDrawer: true });

  expect(screen.getByText("No new notifications for now")).toBeInTheDocument();
  await act(async () => {
    const request = store.dispatch(fetchNotifications());
    mockAxios.mockResponseFor(
      { url: "http://localhost:5173/notifications.json" },
      { data: { notifications } }
    );
    await request;
  });
  expect(screen.getAllByRole("listitem")).toHaveLength(3);

  act(() => {
    store.dispatch(hideDrawer());
  });
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  expect(screen.getByText("Your notifications")).toBeInTheDocument();
  mockAxios.reset();
});
