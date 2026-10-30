/* global process */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mockAxios from 'jest-mock-axios'
import App from './App'
import Notifications from '../Notifications/Notifications'
import { user as defaultUser } from '../Context/context'
import { getLatestNotification } from '../utils/utils'

const NOTIFICATIONS_URL = 'http://localhost:5173/notifications.json'
const COURSES_URL = 'http://localhost:5173/courses.json'

const notificationsData = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: '' } },
]

const coursesData = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

const respondWith = async (url, data) => {
  await act(async () => {
    mockAxios.mockResponseFor({ url }, { data })
  })
}

const respondWithNotifications = (notifications = notificationsData) =>
  respondWith(NOTIFICATIONS_URL, { notifications })

const respondWithCourses = (courses = coursesData) =>
  respondWith(COURSES_URL, { courses })

const requestsTo = (url) =>
  mockAxios.get.mock.calls.filter(([calledUrl]) => calledUrl === url)

const renderApp = async () => {
  const view = render(<App />)
  await respondWithNotifications()
  return view
}
const mockContextValues = []
const mockRenderedProps = { BodySection: [], CourseList: [], Login: [] }

function mockWithPropsProbe(name, actualModule) {
  const { createElement } = jest.requireActual('react')
  const { default: ActualComponent } = actualModule

  function PropsProbe(props) {
    mockRenderedProps[name].push(props)
    return createElement(ActualComponent, props)
  }

  return { __esModule: true, default: PropsProbe }
}

jest.mock('../BodySection/BodySection', () =>
  mockWithPropsProbe('BodySection', jest.requireActual('../BodySection/BodySection'))
)
jest.mock('../CourseList/CourseList', () =>
  mockWithPropsProbe('CourseList', jest.requireActual('../CourseList/CourseList'))
)
jest.mock('../Login/Login', () =>
  mockWithPropsProbe('Login', jest.requireActual('../Login/Login'))
)

jest.mock('../Header/Header', () => {
  const { createElement, Fragment, useContext } = jest.requireActual('react')
  const { default: ActualHeader } = jest.requireActual('../Header/Header')
  const { default: context } = jest.requireActual('../Context/context')

  return {
    __esModule: true,
    default: function HeaderWithUserProbe() {
      const contextValue = useContext(context)
      mockContextValues.push(contextValue)
      const { user } = contextValue

      return createElement(
        Fragment,
        null,
        createElement(ActualHeader),
        createElement('output', { 'data-testid': 'user-state', hidden: true }, JSON.stringify(user))
      )
    },
  }
})

const userState = () =>
  JSON.parse(screen.getByTestId('user-state').textContent)

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    mockContextValues.length = 0
    Object.values(mockRenderedProps).forEach((props) => {
      props.length = 0
    })
  })

  afterEach(() => {
    cleanup()
    mockAxios.reset()
    try {
      expect(console.error).not.toHaveBeenCalled()
      expect(console.warn).not.toHaveBeenCalled()
    } finally {
      jest.restoreAllMocks()
    }
  })

  const logIn = async (
    email = 'user@example.com',
    password = 'secret-password'
  ) => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), email)
    await user.type(screen.getByLabelText(/password/i), password)
    await user.click(screen.getByRole('button', { name: /^ok$/i }))
    await respondWithCourses()
  }

  test('renders an h1 with the text School dashboard', async () => {
    await renderApp()

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  test('renders an img element', async () => {
    await renderApp()

    expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument()
  })

  test('renders the News from the School section by default', async () => {
    await renderApp()

    expect(
      screen.getByRole('heading', { name: /news from the school/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/lorem ipsum dolor sit amet/i)
    ).toBeInTheDocument()
  })

  test('wraps the Login form in a body section titled Log in to continue', async () => {
    const { container } = await renderApp()

    expect(
      screen.getByRole('heading', { name: /log in to continue/i })
    ).toBeInTheDocument()
    expect(
      container.querySelectorAll('.bodySectionWithMargin')
    ).not.toHaveLength(0)
  })

  test('renders the Login form until the user logs in', async () => {
    const { container } = await renderApp()

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
    expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
  })

  test('renders the CourseList in place of the Login form once logged in', async () => {
    const { container } = await renderApp()

    await logIn()

    expect(container.querySelector('#CourseList')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /course list/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/available courses/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/login to access the full dashboard/i)
    ).not.toBeInTheDocument()
  })

  test('wraps the CourseList in a body section titled Course list', async () => {
    const { container } = await renderApp()

    await logIn()

    const wrapper = container
      .querySelector('#CourseList')
      .closest('.bodySectionWithMargin')
    expect(wrapper).toBeInTheDocument()
  })

  test('opens the notifications drawer by default', async () => {
    await renderApp()

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('reopens the notifications drawer when Your notifications is clicked', async () => {
    await renderApp()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('closes the notifications drawer when the close button is clicked', async () => {
    await renderApp()

    fireEvent.click(screen.getByText(/your notifications/i))
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(
      screen.queryByText(/here is the list of notifications/i)
    ).not.toBeInTheDocument()
  })

  describe('marking a notification as read', () => {
    test('removes the clicked item from the list and logs its id', async () => {
      const { container } = await renderApp()
      fireEvent.click(screen.getByText(/your notifications/i))

      fireEvent.click(screen.getByText(/new course available/i))

      expect(
        screen.queryByText(/new course available/i)
      ).not.toBeInTheDocument()
      expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/notification 1 has been marked as read/i)
      )
    })

    test('removes only the item that was clicked, whatever its position', async () => {
      const { container } = await renderApp()
      fireEvent.click(screen.getByText(/your notifications/i))

      fireEvent.click(screen.getByText(/new resume available/i))

      const remaining = Array.from(
        container.querySelectorAll('.notification-items li')
      )
      expect(remaining).toHaveLength(2)
      expect(remaining[0]).toHaveTextContent(/new course available/i)
      expect(remaining[1]).toHaveTextContent(/urgent requirement/i)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/notification 2 has been marked as read/i)
      )
    })

    test('shows the empty state once every notification is read', async () => {
      const { container } = await renderApp()
      fireEvent.click(screen.getByText(/your notifications/i))

      for (let i = 0; i < 3; i += 1) {
        fireEvent.click(container.querySelector('.notification-items li'))
      }

      expect(
        screen.getByText(/no new notification for now/i)
      ).toBeInTheDocument()
    })
  })

  describe('the Contact us link of the Footer', () => {
    test('is not displayed before logging in', async () => {
      await renderApp()

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })

    test('appears once logged in and goes away after logging out', async () => {
      await renderApp()

      await logIn()
      expect(
        screen.getByRole('link', { name: /contact us/i })
      ).toBeInTheDocument()

      fireEvent.click(screen.getByText(/^logout$/i))
      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })
  })

  test('keeps the notifications drawer working once logged in', async () => {
    await renderApp()

    await logIn()
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  describe('the logout section of the Header', () => {
    test('is not rendered before logging in', async () => {
      const { container } = await renderApp()

      expect(container.querySelector('#logoutSection')).toBeNull()
    })

    test('welcomes the user by email once logged in', async () => {
      const { container } = await renderApp()

      await logIn()

      expect(container.querySelector('#logoutSection')).toHaveTextContent(
        /welcome user@example\.com/i
      )
    })

    test('logs the user out when logout is clicked', async () => {
      const { container } = await renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(container.querySelector('#logoutSection')).toBeNull()
      expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
      expect(
        screen.getByText(/login to access the full dashboard/i)
      ).toBeInTheDocument()
    })

    test('starts the Login form empty again after logging out', async () => {
      await renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/password/i)).toHaveValue('')
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled()
    })
  })

  test('is a function component', async () => {
    expect(typeof App).toBe('function')
    expect(App.prototype?.isReactComponent).toBeUndefined()
  })

  test('no longer logs out or alerts when ctrl and h are pressed', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const { container } = await renderApp()
    await logIn()

    fireEvent.keyDown(document, { key: 'h', ctrlKey: true })

    expect(alertSpy).not.toHaveBeenCalled()
    expect(container.querySelector('#CourseList')).toBeInTheDocument()
  })

  describe('handleDisplayDrawer and handleHideDrawer', () => {
    const drawerIsOpen = (container) =>
      container.querySelector('.notification-items') !== null

    test('handleHideDrawer sets displayDrawer to false', async () => {
      const { container } = await renderApp()
      expect(drawerIsOpen(container)).toBe(true)

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(drawerIsOpen(container)).toBe(false)
    })

    test('handleDisplayDrawer sets displayDrawer to true', async () => {
      const { container } = await renderApp()
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      fireEvent.click(screen.getByText(/your notifications/i))

      expect(drawerIsOpen(container)).toBe(true)
    })

    test('handleDisplayDrawer keeps an open drawer open', async () => {
      const { container } = await renderApp()

      fireEvent.click(screen.getByText(/your notifications/i))

      expect(drawerIsOpen(container)).toBe(true)
    })

    test('can be toggled again and again', async () => {
      const { container } = await renderApp()

      for (let i = 0; i < 2; i += 1) {
        fireEvent.click(screen.getByRole('button', { name: /close/i }))
        expect(drawerIsOpen(container)).toBe(false)
        fireEvent.click(screen.getByText(/your notifications/i))
        expect(drawerIsOpen(container)).toBe(true)
      }
    })
  })

  describe('the user state', () => {
    test('starts as the user of the context: logged out, no credentials', async () => {
      await renderApp()

      expect(userState()).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })
    })

    test('logIn sets the email, the password and isLoggedIn to true', async () => {
      await renderApp()

      await logIn()

      expect(userState()).toEqual({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })
    })

    test('logOut sets isLoggedIn to false and clears the email and password', async () => {
      await renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(userState()).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })
    })

    test('logIn works again after a logOut, with the new credentials', async () => {
      await renderApp()
      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))

      await logIn('other@example.com', 'other-password')

      expect(userState()).toEqual({
        email: 'other@example.com',
        password: 'other-password',
        isLoggedIn: true,
      })
    })
  })

  test('keeps the notifications when the user logs in and out', async () => {
    const { container } = await renderApp()
    fireEvent.click(screen.getByText(/new course available/i))

    await logIn()
    fireEvent.click(screen.getByText(/^logout$/i))

    expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
  })

  test.each(['secret-password', 'short'])(
    'preserves notifications across direct form submissions with password %s',
    async (password) => {
      const notificationsSpy = jest.spyOn(Notifications, 'type')
      const { container } = await renderApp()
      fireEvent.click(screen.getByText('New course available'))
      const remainingNotifications = notificationsSpy.mock.lastCall[0].notifications
      const renderCount = notificationsSpy.mock.calls.length

      for (let cycle = 0; cycle < 2; cycle += 1) {
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'user@example.com' },
        })
        fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: password },
        })
        fireEvent.submit(container.querySelector('form'))

        expect(screen.getByRole('heading', { name: 'Course list' })).toBeInTheDocument()
        expect(screen.getByText(/welcome user@example\.com/i)).toBeInTheDocument()
        expect(screen.queryByText('New course available')).not.toBeInTheDocument()
        await respondWithCourses()
        expect(screen.getByText('ES6')).toBeInTheDocument()

        fireEvent.click(screen.getByText(/^logout$/i))

        expect(screen.getByLabelText(/email/i)).toHaveValue('')
        expect(screen.queryByText(/welcome user@example\.com/i)).not.toBeInTheDocument()
        expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
        expect(screen.getByText('New resume available')).toBeInTheDocument()
        expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument()
        expect(notificationsSpy.mock.lastCall[0].notifications).toBe(remainingNotifications)
        expect(notificationsSpy).toHaveBeenCalledTimes(renderCount)
      }

      expect(requestsTo(NOTIFICATIONS_URL)).toHaveLength(1)
    }
  )

  test('renders the fetched notifications, including the latest markup', async () => {
    const { container } = await renderApp()
    const items = container.querySelectorAll('.notification-items li')

    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('New course available')
    expect(items[1]).toHaveTextContent('New resume available')
    expect(items[2].innerHTML).toBe(getLatestNotification())
  })

  test('renders the fetched courses as soon as the user logs in', async () => {
    const { container } = await renderApp()

    await logIn()

    const rows = Array.from(container.querySelectorAll('#CourseList tbody tr'))
    expect(rows.map((row) => row.textContent)).toEqual([
      'ES660',
      'Webpack20',
      'React40',
    ])
  })

  test('logIn and logOut replace user without mutating previous users', async () => {
    await renderApp()
    const initialUser = mockContextValues.at(-1).user
    expect(initialUser).toBe(defaultUser)

    await logIn()
    const loggedInUser = mockContextValues.at(-1).user

    expect(loggedInUser).not.toBe(initialUser)
    expect(initialUser).toEqual({ email: '', password: '', isLoggedIn: false })

    fireEvent.click(screen.getByText(/^logout$/i))

    expect(mockContextValues.at(-1).user).not.toBe(loggedInUser)
    expect(loggedInUser).toEqual({
      email: 'user@example.com',
      password: 'secret-password',
      isLoggedIn: true,
    })
    expect(userState()).toEqual({ email: '', password: '', isLoggedIn: false })
  })

  test('removes two notifications in one update without mutating the original list', async () => {
    const notificationsSpy = jest.spyOn(Notifications, 'type')
    const { container } = await renderApp()
    const { notifications, markNotificationAsRead } =
      notificationsSpy.mock.lastCall[0]
    const originalNotifications = notifications.map((notification) => ({ ...notification }))

    act(() => {
      markNotificationAsRead(1)
      markNotificationAsRead(2)
    })

    expect(container.querySelectorAll('.notification-items li')).toHaveLength(1)
    expect(screen.queryByText('New course available')).not.toBeInTheDocument()
    expect(screen.queryByText('New resume available')).not.toBeInTheDocument()
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument()
    expect(notifications).toEqual(originalNotifications)
    expect(notificationsSpy.mock.lastCall[0].notifications).not.toBe(notifications)
  })

  test('keeps drawer callbacks and logOut stable across state changes', async () => {
    const notificationsSpy = jest.spyOn(Notifications, 'type')
    await renderApp()
    const initialProps = notificationsSpy.mock.lastCall[0]
    const initialContext = mockContextValues.at(-1)

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    const closedProps = notificationsSpy.mock.lastCall[0]
    expect(closedProps.displayDrawer).toBe(false)
    expect(closedProps.handleDisplayDrawer).toBe(initialProps.handleDisplayDrawer)
    expect(closedProps.handleHideDrawer).toBe(initialProps.handleHideDrawer)
    expect(closedProps.markNotificationAsRead).toBe(initialProps.markNotificationAsRead)
    expect(mockContextValues.at(-1)).toBe(initialContext)

    await logIn()

    expect(mockContextValues.at(-1).logOut).toBe(initialContext.logOut)
    fireEvent.click(screen.getByText(/your notifications/i))
    const reopenedProps = notificationsSpy.mock.lastCall[0]
    expect(reopenedProps.displayDrawer).toBe(true)
    expect(reopenedProps.handleDisplayDrawer).toBe(initialProps.handleDisplayDrawer)
    expect(reopenedProps.handleHideDrawer).toBe(initialProps.handleHideDrawer)
    expect(reopenedProps.markNotificationAsRead).toBe(initialProps.markNotificationAsRead)
  })

  test('starts a new App with all notifications after another App marks one as read', async () => {
    const { unmount } = await renderApp()
    fireEvent.click(screen.getByText('New course available'))

    unmount()
    const { container } = await renderApp()

    expect(container.querySelectorAll('.notification-items li')).toHaveLength(3)
    expect(screen.getByText('New course available')).toBeInTheDocument()
  })

  describe('the data types of props passed down by App', () => {
    const expectNotificationProps = (props) => {
      expect(typeof props.displayDrawer).toBe('boolean')
      expect(typeof props.handleDisplayDrawer).toBe('function')
      expect(typeof props.handleHideDrawer).toBe('function')
      expect(typeof props.markNotificationAsRead).toBe('function')
      expect(Array.isArray(props.notifications)).toBe(true)
      props.notifications.forEach(({ id, type, value, html }) => {
        expect(typeof id).toBe('number')
        expect(['default', 'urgent']).toContain(type)
        if (html !== undefined) {
          expect(html).toEqual({ __html: expect.any(String) })
        } else {
          expect(typeof value).toBe('string')
        }
      })
    }

    test('passes boolean drawer state, typed notifications and function callbacks', async () => {
      const notificationsSpy = jest.spyOn(Notifications, 'type')
      await renderApp()

      expectNotificationProps(notificationsSpy.mock.lastCall[0])
      expect(notificationsSpy.mock.lastCall[0].displayDrawer).toBe(true)

      fireEvent.click(screen.getByRole('button', { name: /close/i }))
      expectNotificationProps(notificationsSpy.mock.lastCall[0])
      expect(notificationsSpy.mock.lastCall[0].displayDrawer).toBe(false)

      fireEvent.click(screen.getByText(/your notifications/i))
      fireEvent.click(screen.getByText('New course available'))
      expectNotificationProps(notificationsSpy.mock.lastCall[0])
      expect(notificationsSpy.mock.lastCall[0].notifications).toHaveLength(2)
    })

    test('passes courses with numeric ids and credits rather than numeric strings', async () => {
      await renderApp()
      await logIn()

      expect(mockRenderedProps.CourseList.length).toBeGreaterThan(0)
      expect(mockRenderedProps.CourseList.at(-1).courses).toStrictEqual([
        { id: 1, name: 'ES6', credit: 60 },
        { id: 2, name: 'Webpack', credit: 20 },
        { id: 3, name: 'React', credit: 40 },
      ])
    })

    test('passes string credentials and a login function before and after logout', async () => {
      await renderApp()
      expect(mockRenderedProps.Login.length).toBeGreaterThan(0)
      expect(mockRenderedProps.Login.at(-1)).toEqual(expect.objectContaining({
        email: '',
        password: '',
        logIn: expect.any(Function),
      }))

      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))

      mockRenderedProps.Login.forEach(({ email, password, logIn: loginHandler }) => {
        expect(typeof email).toBe('string')
        expect(typeof password).toBe('string')
        expect(typeof loginHandler).toBe('function')
      })
    })

    test('passes string section titles and a correctly typed context throughout authentication', async () => {
      await renderApp()
      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))

      expect(mockRenderedProps.BodySection.length).toBeGreaterThan(0)
      mockRenderedProps.BodySection.forEach(({ title }) => {
        expect(typeof title).toBe('string')
      })
      mockContextValues.forEach(({ user, logOut }) => {
        expect(typeof user.email).toBe('string')
        expect(typeof user.password).toBe('string')
        expect(typeof user.isLoggedIn).toBe('boolean')
        expect(typeof logOut).toBe('function')
      })
    })
  })

  describe('data fetching', () => {
    const failNextRequest = async () => {
      await act(async () => {
        mockAxios.mockError(new Error('Network Error'))
      })
    }

    test('requests the notifications as soon as the App renders', () => {
      render(<App />)

      expect(requestsTo(NOTIFICATIONS_URL)).toHaveLength(1)
    })

    test('shows no notification until the response arrives', async () => {
      const { container } = render(<App />)

      expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument()
      expect(container.querySelectorAll('.notification-items li')).toHaveLength(0)

      await respondWithNotifications()

      expect(container.querySelectorAll('.notification-items li')).toHaveLength(3)
    })

    test('requests the notifications only once, whatever the user does', async () => {
      await renderApp()

      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))
      await logIn()

      expect(requestsTo(NOTIFICATIONS_URL)).toHaveLength(1)
    })

    test('does not request the courses while the user is logged out', async () => {
      await renderApp()

      expect(requestsTo(COURSES_URL)).toHaveLength(0)
    })

    test('requests the courses when the user logs in', async () => {
      await renderApp()

      await logIn()

      expect(requestsTo(COURSES_URL)).toHaveLength(1)
    })

    test('requests the courses again each time the user logs in', async () => {
      await renderApp()

      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))
      expect(requestsTo(COURSES_URL)).toHaveLength(1)

      await logIn('other@example.com', 'another-password')
      expect(requestsTo(COURSES_URL)).toHaveLength(2)
    })

    test('renders the courses returned by the response', async () => {
      const { container } = await renderApp()
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))
      await respondWithCourses([{ id: 7, name: 'Node', credit: 30 }])

      const rows = Array.from(container.querySelectorAll('#CourseList tbody tr'))
      expect(rows.map((row) => row.textContent)).toEqual(['Node30'])
    })

    test('fills the empty markup of the latest notification', async () => {
      const { container } = await renderApp()

      expect(container.querySelectorAll('.notification-items li')[2].innerHTML).toBe(
        getLatestNotification()
      )
    })

    test('keeps the App usable when the notifications request fails', async () => {
      const { container } = render(<App />)

      await failNextRequest()

      expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument()
      expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    test('keeps the course list empty when the courses request fails', async () => {
      const { container } = await renderApp()
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))
      await failNextRequest()

      expect(container.querySelector('#CourseList')).toBeInTheDocument()
      expect(screen.getByText(/no course available yet/i)).toBeInTheDocument()
    })

    test('logs a failed request to the console in development mode only', async () => {
      const previousEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      try {
        render(<App />)
        await failNextRequest()

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(expect.any(Error))
        console.error.mockClear()
      } finally {
        process.env.NODE_ENV = previousEnv
      }
    })

    test('stays silent about a failed request outside development mode', async () => {
      render(<App />)

      await failNextRequest()

      expect(console.error).not.toHaveBeenCalled()
    })

    test('ignores a response that arrives after the App is unmounted', async () => {
      const { unmount } = render(<App />)

      unmount()
      await respondWithNotifications()

      expect(console.error).not.toHaveBeenCalled()
    })
  })
})
