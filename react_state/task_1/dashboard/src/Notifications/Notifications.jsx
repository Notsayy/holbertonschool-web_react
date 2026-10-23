import { Component } from 'react';
import PropTypes from 'prop-types';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.markAsRead = this.markAsRead.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const prevLen = this.props.notifications ? this.props.notifications.length : 0;
    const nextLen = nextProps.notifications ? nextProps.notifications.length : 0;
    return (
      nextLen !== prevLen ||
      nextProps.displayDrawer !== this.props.displayDrawer
    );
  }

  markAsRead(id) {
    console.log(`Notification ${id} has been marked as read`);
  }

  render() {
    const {
      displayDrawer,
      notifications,
      handleDisplayDrawer,
      handleHideDrawer,
    } = this.props;
    const isBouncing = notifications && notifications.length > 0 && !displayDrawer;

    const handleClose = () => {
      console.log('Close button has been clicked');
      handleHideDrawer();
    };

    return (
      <>
        <div
          className={`notification-title text-right cursor-pointer${isBouncing ? ' animate-bounce' : ''}`}
          onClick={handleDisplayDrawer}
        >
          Your notifications
        </div>
        {displayDrawer && (
          <div className="notification-items border-2 border-dashed border-[var(--main-color)] p-1.5 relative mt-[5px] max-[912px]:fixed max-[912px]:top-0 max-[912px]:left-0 max-[912px]:w-full max-[912px]:h-full max-[912px]:bg-white max-[912px]:z-50 max-[912px]:p-3 max-[912px]:m-0 max-[912px]:text-[20px]">
            <button
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
              aria-label="Close"
              onClick={handleClose}
            >
              <img src={closeIcon} alt="close icon" width="10px" height="10px" />
            </button>
            {notifications && notifications.length > 0 ? (
              <>
                <p className="max-[912px]:text-[20px]">Here is the list of notifications</p>
                <ul className="max-[912px]:list-none max-[912px]:p-0 max-[912px]:m-0">
                  {notifications.map((notif) => {
                    let htmlProp;
                    let valueProp;

                    if (typeof notif.value === 'object' && notif.value !== null && notif.value.__html) {
                      htmlProp = notif.value;
                    } else if (notif.html) {
                      htmlProp = notif.html;
                    } else if (typeof notif.value === 'string' && notif.value.includes('<strong>')) {
                      htmlProp = { __html: notif.value };
                    } else {
                      valueProp = notif.value;
                    }

                    return (
                      <NotificationItem
                        key={notif.id}
                        id={notif.id}
                        type={notif.type}
                        value={valueProp}
                        html={htmlProp}
                        markAsRead={this.markAsRead}
                      />
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="max-[912px]:text-[20px]">No new notification for now</p>
            )}
          </div>
        )}
      </>
    );
  }
}

Notifications.propTypes = {
  displayDrawer: PropTypes.bool,
  handleDisplayDrawer: PropTypes.func,
  handleHideDrawer: PropTypes.func,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      html: PropTypes.shape({
        __html: PropTypes.string,
      }),
    })
  ),
};

Notifications.defaultProps = {
  displayDrawer: false,
  handleDisplayDrawer: () => {},
  handleHideDrawer: () => {},
  notifications: [],
};

export default Notifications;
