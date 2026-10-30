import { render, screen, fireEvent } from "@testing-library/react";
import Notifications from "./Notifications";
import { getLatestNotification } from "../utils/utils";

const notificationsList = [
  { id: 1, type: "default", value: "New course available" },
  { id: 2, type: "urgent", value: "New resume available" },
  { id: 3, type: "urgent", value: { __html: getLatestNotification() } },
];

describe("Notifications", () => {
  test("always renders the notification-title with the text Your notifications", () => {
    const { container } = render(
      <Notifications notifications={notificationsList} />,
    );

    expect(container.querySelector(".notification-title")).toHaveTextContent(
      /your notifications/i,
    );
  });

  describe("when displayDrawer is false", () => {
    test("still renders the text Your notifications", () => {
      render(
        <Notifications
          displayDrawer={false}
          notifications={notificationsList}
        />,
      );

      expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    });

    test("does not render the close button", () => {
      render(
        <Notifications
          displayDrawer={false}
          notifications={notificationsList}
        />,
      );

      expect(
        screen.queryByRole("button", { name: /close/i }),
      ).not.toBeInTheDocument();
    });

    test("does not render the p element with the list title", () => {
      render(
        <Notifications
          displayDrawer={false}
          notifications={notificationsList}
        />,
      );

      expect(
        screen.queryByText(/here is the list of notifications/i),
      ).not.toBeInTheDocument();
    });

    test("does not render the notification items", () => {
      const { container } = render(
        <Notifications
          displayDrawer={false}
          notifications={notificationsList}
        />,
      );

      expect(container.querySelectorAll("li")).toHaveLength(0);
      expect(container.querySelector(".notification-items")).toBeNull();
    });
  });

  describe("when displayDrawer is true", () => {
    test("still renders the text Your notifications", () => {
      render(<Notifications displayDrawer notifications={notificationsList} />);

      expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    });

    test("renders the close button", () => {
      render(<Notifications displayDrawer notifications={notificationsList} />);

      expect(
        screen.getByRole("button", { name: /close/i }),
      ).toBeInTheDocument();
    });

    test("renders the p element with the list title", () => {
      render(<Notifications displayDrawer notifications={notificationsList} />);

      expect(
        screen.getByText(/here is the list of notifications/i),
      ).toBeInTheDocument();
    });

    test("renders the 3 notification items with their text", () => {
      const { container } = render(
        <Notifications displayDrawer notifications={notificationsList} />,
      );
      const items = Array.from(container.querySelectorAll("li"));

      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent(/new course available/i);
      expect(items[1]).toHaveTextContent(/new resume available/i);
      expect(items[2]).toHaveTextContent(
        /urgent requirement - complete by eod/i,
      );
      expect(items[2].querySelector("strong")).toBeInTheDocument();
    });

    test("renders each notification item with its type", () => {
      const { container } = render(
        <Notifications displayDrawer notifications={notificationsList} />,
      );
      const items = Array.from(container.querySelectorAll("li"));

      expect(items[0]).toHaveAttribute("data-notification-type", "default");
      expect(items[1]).toHaveAttribute("data-notification-type", "urgent");
      expect(items[2]).toHaveAttribute("data-notification-type", "urgent");
    });

    test("does not log anything when the close button is clicked", () => {
      const consoleSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      render(<Notifications displayDrawer notifications={notificationsList} />);

      consoleSpy.mockClear();
      fireEvent.click(screen.getByRole("button", { name: /close/i }));

      try {
        expect(consoleSpy).not.toHaveBeenCalled();
      } finally {
        consoleSpy.mockRestore();
      }
    });

    test("calls markNotificationAsRead with the id of the clicked item", () => {
      const markNotificationAsRead = jest.fn();
      const { container } = render(
        <Notifications
          displayDrawer
          notifications={notificationsList}
          markNotificationAsRead={markNotificationAsRead}
        />,
      );
      const items = Array.from(container.querySelectorAll("li"));

      fireEvent.click(items[0]);

      expect(markNotificationAsRead).toHaveBeenLastCalledWith(1);

      fireEvent.click(items[1]);

      expect(markNotificationAsRead).toHaveBeenLastCalledWith(2);
      expect(markNotificationAsRead).toHaveBeenCalledTimes(2);
    });
  });

  test("is a function component wrapped in memo", () => {
    expect(Notifications.$$typeof).toBe(Symbol.for("react.memo"));
    expect(typeof Notifications.type).toBe("function");
    expect(Notifications.type.prototype?.isReactComponent).toBeUndefined();

    expect(typeof Notifications.compare).toBe("function");
  });

  describe("when it receives new props", () => {
    let renderSpy;

    beforeEach(() => {
      renderSpy = jest.spyOn(Notifications, "type");
    });

    afterEach(() => {
      renderSpy.mockRestore();
    });

    test("does not re-render when given the very same props", () => {
      const { rerender } = render(
        <Notifications displayDrawer notifications={notificationsList} />,
      );

      rerender(
        <Notifications displayDrawer notifications={notificationsList} />,
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test("renders a new list even when it has the same length", () => {
      const { container, rerender } = render(
        <Notifications displayDrawer notifications={notificationsList} />,
      );
      const sameLength = [
        { id: 1, type: "default", value: "Updated course" },
        { id: 2, type: "urgent", value: "Updated resume" },
        { id: 3, type: "urgent", value: "Updated requirement" },
      ];

      rerender(<Notifications displayDrawer notifications={sameLength} />);

      expect(renderSpy).toHaveBeenCalledTimes(2);
      expect(screen.getByText(/updated course/i)).toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(3);
    });

    test("does not re-render when the callbacks keep their reference", () => {
      const markNotificationAsRead = () => {};
      const { rerender } = render(
        <Notifications
          displayDrawer
          notifications={notificationsList}
          markNotificationAsRead={markNotificationAsRead}
        />,
      );

      rerender(
        <Notifications
          displayDrawer
          notifications={notificationsList}
          markNotificationAsRead={markNotificationAsRead}
        />,
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test("re-renders when a callback changes reference", () => {
      const { rerender } = render(
        <Notifications
          displayDrawer
          notifications={notificationsList}
          markNotificationAsRead={() => {}}
        />,
      );

      rerender(
        <Notifications
          displayDrawer
          notifications={notificationsList}
          markNotificationAsRead={() => {}}
        />,
      );

      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test("renders a shorter list once a notification is removed", () => {
      const { container, rerender } = render(
        <Notifications displayDrawer notifications={notificationsList} />,
      );

      rerender(
        <Notifications
          displayDrawer
          notifications={notificationsList.filter(({ id }) => id !== 1)}
        />,
      );

      expect(renderSpy).toHaveBeenCalledTimes(2);
      expect(
        screen.queryByText(/new course available/i),
      ).not.toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(2);
    });

    test("renders a longer list once a notification is added", () => {
      const { container, rerender } = render(
        <Notifications displayDrawer notifications={notificationsList} />,
      );

      rerender(
        <Notifications
          displayDrawer
          notifications={[
            ...notificationsList,
            { id: 4, type: "default", value: "New project available" },
          ]}
        />,
      );

      expect(renderSpy).toHaveBeenCalledTimes(2);
      expect(screen.getByText(/new project available/i)).toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(4);
    });

    test("re-renders when the drawer opens", () => {
      const { container, rerender } = render(
        <Notifications
          displayDrawer={false}
          notifications={notificationsList}
        />,
      );

      rerender(
        <Notifications displayDrawer notifications={notificationsList} />,
      );

      expect(renderSpy).toHaveBeenCalledTimes(2);
      expect(
        container.querySelector(".notification-items"),
      ).toBeInTheDocument();
    });

    test("re-renders when the drawer closes", () => {
      const { container, rerender } = render(
        <Notifications displayDrawer notifications={notificationsList} />,
      );

      rerender(
        <Notifications
          displayDrawer={false}
          notifications={notificationsList}
        />,
      );

      expect(renderSpy).toHaveBeenCalledTimes(2);
      expect(container.querySelector(".notification-items")).toBeNull();
    });
  });

  describe("when displayDrawer is true and notifications is empty", () => {
    test("renders the text No new notification for now", () => {
      render(<Notifications displayDrawer notifications={[]} />);

      expect(
        screen.getByText(/no new notification for now/i),
      ).toBeInTheDocument();
    });

    test("still renders the text Your notifications", () => {
      render(<Notifications displayDrawer notifications={[]} />);

      expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    });

    test("does not render any notification item", () => {
      const { container } = render(
        <Notifications displayDrawer notifications={[]} />,
      );

      expect(container.querySelectorAll("li")).toHaveLength(0);
    });

    test("falls back to the empty state without the notifications prop", () => {
      render(<Notifications displayDrawer />);

      expect(
        screen.getByText(/no new notification for now/i),
      ).toBeInTheDocument();
    });
  });

  describe("the drawer callbacks", () => {
    test("calls handleDisplayDrawer when the menu item is clicked", () => {
      const handleDisplayDrawer = jest.fn();
      render(
        <Notifications
          displayDrawer={false}
          notifications={notificationsList}
          handleDisplayDrawer={handleDisplayDrawer}
        />,
      );

      fireEvent.click(screen.getByText(/your notifications/i));

      expect(handleDisplayDrawer).toHaveBeenCalledTimes(1);
    });

    test("calls handleHideDrawer when the close button is clicked", () => {
      const consoleSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const handleHideDrawer = jest.fn();
      render(
        <Notifications
          displayDrawer
          notifications={notificationsList}
          handleHideDrawer={handleHideDrawer}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /close/i }));

      expect(handleHideDrawer).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });
  });
  describe("the bouncing title", () => {
    const title = (container) => container.querySelector(".notification-title");

    test("bounces when the drawer is closed and notifications remain", () => {
      const { container } = render(
        <Notifications
          displayDrawer={false}
          notifications={notificationsList}
        />,
      );

      expect(title(container)).toHaveClass("animate-bounce");
    });

    test("does not bounce once the drawer is open", () => {
      const { container } = render(
        <Notifications displayDrawer notifications={notificationsList} />,
      );

      expect(title(container)).not.toHaveClass("animate-bounce");
    });

    test("does not bounce when there is nothing to read", () => {
      const { container } = render(
        <Notifications displayDrawer={false} notifications={[]} />,
      );

      expect(title(container)).not.toHaveClass("animate-bounce");
    });
  });
});
