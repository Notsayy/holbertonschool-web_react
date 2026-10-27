import { Component } from 'react';
import newContext from '../Context/context';
import Notifications from '../Notifications/Notifications';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Footer from '../Footer/Footer';
import CourseList from '../CourseList/CourseList';
import BodySection from '../BodySection/BodySection';
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom';
import { getLatestNotification } from '../utils/utils';

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
];

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.state = {
      displayDrawer: false,
      notifications: notificationsList,
      courses: coursesList,
      user: {
        email: '',
        password: '',
        isLoggedIn: false,
      },
      logOut: this.logOut,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDisplayDrawer = this.handleDisplayDrawer.bind(this);
    this.handleHideDrawer = this.handleHideDrawer.bind(this);
    this.markNotificationAsRead = this.markNotificationAsRead.bind(this);
  }

  markNotificationAsRead(id) {
    console.log(`Notification ${id} has been marked as read`);
    this.setState((prevState) => ({
      notifications: prevState.notifications.filter((notification) => notification.id !== id),
    }));
  }

  logIn(email, password) {
    this.setState({ user: { email, password, isLoggedIn: true } });
  }

  logOut() {
    this.setState({
      user: {
        email: '',
        password: '',
        isLoggedIn: false,
      },
    });
  }

  handleDisplayDrawer() {
    this.setState({ displayDrawer: true });
  }

  handleHideDrawer() {
    this.setState({ displayDrawer: false });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.ctrlKey && (event.key === 'h' || event.key === 'H')) {
      alert('Logging you out');
      this.state.logOut();
    }
  }

  render() {
    const { displayDrawer, user, notifications, courses } = this.state;
    const { email, password, isLoggedIn } = user;
    return (
      <newContext.Provider value={this.state}>
        <div className="root-notifications relative z-10 flex flex-col items-end p-2.5 pb-0 max-[912px]:absolute max-[912px]:top-0 max-[912px]:right-0 max-[912px]:p-0 max-[912px]:pt-1 max-[912px]:pr-5">
          <Notifications
            displayDrawer={displayDrawer}
            handleDisplayDrawer={this.handleDisplayDrawer}
            handleHideDrawer={this.handleHideDrawer}
            notifications={notifications}
            markNotificationAsRead={this.markNotificationAsRead}
          />
        </div>
        <div className={`App min-h-screen flex flex-col justify-between p-4 sm:p-8 max-[520px]:p-3 max-[520px]:pt-0 ${isLoggedIn ? 'max-[520px]:pb-0 max-[520px]:[&_.App-footer]:text-base max-[520px]:[&_.App-header]:pb-[21px]' : ''}`}>
          <Header />
          <div className="flex-1">
            {isLoggedIn ? (
              <BodySectionWithMarginBottom title="Course list">
                <CourseList courses={courses} />
              </BodySectionWithMarginBottom>
            ) : (
              <BodySectionWithMarginBottom title="Log in to continue">
                <Login logIn={this.logIn} email={email} password={password} />
              </BodySectionWithMarginBottom>
            )}
          </div>
          <BodySection title="News from the School">
            <p className="max-[520px]:-mt-3 max-[520px]:-mb-5">ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique, asperiores architecto blanditiis fuga doloribus sit illum aliquid ea distinctio minus accusantium, impedit quo voluptatibus ut magni dicta. Recusandae, quia dicta?</p>
          </BodySection>
          <Footer />
        </div>
      </newContext.Provider>
    );
  }
}

export default App;
