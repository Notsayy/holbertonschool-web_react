
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

export const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: getLatestNotification() } },
]

export const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

function App() {


  const [displayDrawer, setDisplayDrawer] = useState(true)


  const [user, setUser] = useState(defaultUser)
  const [notifications, setNotifications] = useState(notificationsList)




  useEffect(() => {
    let isMounted = true

    axios
      .get('http://localhost:5173/notifications.json')
      .then(({ data }) => {
        if (!isMounted || !Array.isArray(data?.notifications)) return


        setNotifications(
          data.notifications.map((notification) =>
            notification.html && !notification.html.__html
              ? { ...notification, html: { __html: getLatestNotification() } }
              : notification
          )
        )
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])


  const [courses, setCourses] = useState(coursesList)

  useEffect(() => {
    if (!user.isLoggedIn) return undefined
    let isMounted = true

    axios
      .get('http://localhost:5173/courses.json')
      .then(({ data }) => {
        if (isMounted && Array.isArray(data?.courses)) setCourses(data.courses)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [user.isLoggedIn])



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
      {}
      <div className="relative flex min-h-screen flex-col px-3">
        <div className="root-notifications">
          {}
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
