import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import Notifications from './components/Notifications/Notifications';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import CourseList from './pages/CourseList/CourseList';
import BodySectionWithMarginBottom from './components/BodySectionWithMarginBottom/BodySectionWithMarginBottom';
import BodySection from './components/BodySection/BodySection';
import { fetchNotifications } from './features/notifications/notificationsSlice';
import { fetchCourses } from './features/courses/coursesSlice';

const styles = StyleSheet.create({
  app: {
    position: 'relative'
  }
});

export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const request = dispatch(fetchNotifications());
    request.unwrap().catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Error fetching notifications:', error);
      }
    });
    return () => request.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const request = dispatch(fetchCourses());
    request.unwrap().catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Error fetching courses:', error);
      }
    });
    return () => request.abort();
  }, [dispatch, isLoggedIn]);

  return (
    <div className={css(styles.app)}>
      <Notifications />
      <Header />
      {!isLoggedIn ? (
        <BodySectionWithMarginBottom title='Log in to continue'>
          <Login />
        </BodySectionWithMarginBottom>
      ) : (
        <BodySectionWithMarginBottom title='Course list'>
          <CourseList />
        </BodySectionWithMarginBottom>
      )}
      <BodySection title="News from the School">
        <p>Holberton School news goes here</p>
      </BodySection>
      <Footer />
    </div>
  );
}
