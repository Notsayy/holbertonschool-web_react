/* global process */
import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import BodySection from '../BodySection/BodySection'
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom'
import newContext, { user as defaultUser } from '../Context/context'
import { getLatestNotification } from '../utils/utils'

const ContextProvider = newContext.Provider

const NOTIFICATIONS_URL = 'http://localhost:5173/notifications.json'
const COURSES_URL = 'http://localhost:5173/courses.json'

const logError = (error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(error)
  }
}

const withLatestNotification = (notification) =>
  notification.html && !notification.html.__html
    ? { ...notification, html: { __html: getLatestNotification() } }
    : notification

function App() {
  const [displayDrawer, setDisplayDrawer] = useState(true)
  const [user, setUser] = useState(defaultUser)
  const [notifications, setNotifications] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    let isCancelled = false

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(NOTIFICATIONS_URL)
        if (!isCancelled && Array.isArray(data?.notifications)) {
          setNotifications(data.notifications.map(withLatestNotification))
        }
      } catch (error) {
        logError(error)
      }
    }

    fetchNotifications()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!user.isLoggedIn) return undefined

    let isCancelled = false

    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(COURSES_URL)
        if (!isCancelled && Array.isArray(data?.courses)) {
          setCourses(data.courses)
        }
      } catch (error) {
        logError(error)
      }
    }

    fetchCourses()

    return () => {
      isCancelled = true
    }
  }, [user])

  const handleDisplayDrawer = useCallback(() => {
    setDisplayDrawer(true)
  }, [])

  const handleHideDrawer = useCallback(() => {
    setDisplayDrawer(false)
  }, [])

  const logIn = useCallback((email, password) => {
    setUser({ email, password, isLoggedIn: true })
  }, [])

  const logOut = useCallback(() => {
    setUser(defaultUser)
  }, [])

  const markNotificationAsRead = useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`)
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    )
  }, [])

  const contextValue = useMemo(() => ({ user, logOut }), [user, logOut])

  return (
    <ContextProvider value={contextValue}>
            <div className="relative flex min-h-screen flex-col px-3">
        <div className="root-notifications">
                    <Notifications
            notifications={notifications}
            displayDrawer={displayDrawer}
            handleDisplayDrawer={handleDisplayDrawer}
            handleHideDrawer={handleHideDrawer}
            markNotificationAsRead={markNotificationAsRead}
          />
        </div>
        <Header />
        <div className="App-body pt-[38px]">
          {user.isLoggedIn ? (
            <BodySectionWithMarginBottom title="Course list">
              <CourseList courses={courses} />
            </BodySectionWithMarginBottom>
          ) : (
            <BodySectionWithMarginBottom title="Log in to continue">
              <Login
                logIn={logIn}
                email={user.email}
                password={user.password}
              />
            </BodySectionWithMarginBottom>
          )}
          <BodySection title="News from the School">
            <p>
              ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Similique, asperiores architecto blanditiis fuga doloribus sit
              illum aliquid ea distinctio minus accusantium, impedit quo
              voluptatibus ut magni dicta. Recusandae, quia dicta?
            </p>
          </BodySection>
        </div>
        <Footer />
      </div>
    </ContextProvider>
  )
}

export default App
