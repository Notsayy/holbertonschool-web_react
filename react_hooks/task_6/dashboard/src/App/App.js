/* global process */
import { createElement, useCallback, useEffect, useReducer } from 'react'
import axios from 'axios'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import BodySection from '../BodySection/BodySection'
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom'
import appReducer, { APP_ACTIONS, initialState } from './appReducer'
import { getLatestNotification } from '../utils/utils'

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
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { displayDrawer, user, notifications, courses } = state

  useEffect(() => {
    let isCancelled = false

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(NOTIFICATIONS_URL)
        if (!isCancelled && Array.isArray(data?.notifications)) {
          dispatch({
            type: APP_ACTIONS.SET_NOTIFICATIONS,
            payload: data.notifications.map(withLatestNotification),
          })
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
          dispatch({ type: APP_ACTIONS.SET_COURSES, payload: data.courses })
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
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER, payload: true })
  }, [])

  const handleHideDrawer = useCallback(() => {
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER, payload: false })
  }, [])

  const logIn = useCallback((email, password) => {
    dispatch({ type: APP_ACTIONS.LOGIN, payload: { email, password } })
  }, [])

  const logOut = useCallback(() => {
    dispatch({ type: APP_ACTIONS.LOGOUT })
  }, [])

  const markNotificationAsRead = useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`)
    dispatch({ type: APP_ACTIONS.MARK_NOTIFICATION_READ, payload: id })
  }, [])

  return createElement(
    'div',
    { className: 'relative flex min-h-screen flex-col px-3' },
    createElement(
      'div',
      { className: 'root-notifications' },
      createElement(Notifications, {
        notifications,
        displayDrawer,
        handleDisplayDrawer,
        handleHideDrawer,
        markNotificationAsRead,
      })
    ),
    createElement(Header, { user, logOut }),
    createElement(
      'div',
      { className: 'App-body pt-[38px]' },
      user.isLoggedIn
        ? createElement(
            BodySectionWithMarginBottom,
            { title: 'Course list' },
            createElement(CourseList, { courses })
          )
        : createElement(
            BodySectionWithMarginBottom,
            { title: 'Log in to continue' },
            createElement(Login, { logIn, email: user.email, password: user.password })
          ),
      createElement(
        BodySection,
        { title: 'News from the School' },
        createElement(
          'p',
          null,
          'ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit. ' +
            'Similique, asperiores architecto blanditiis fuga doloribus sit ' +
            'illum aliquid ea distinctio minus accusantium, impedit quo ' +
            'voluptatibus ut magni dicta. Recusandae, quia dicta?'
        )
      )
    ),
    createElement(Footer, { user })
  )
}

export default App
