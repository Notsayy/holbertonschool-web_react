import PropTypes from 'prop-types';
import './Notifications.css';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';

function Notifications({ displayDrawer = false, notifications = [] }) {
  const handleClose = () => {
    console.log('Close button has been clicked');
  };

  return (
    <>
      <div className="notification-title">Your notifications</div>
      {displayDrawer && (
        <div className="notification-items">
          {notifications.length > 0 ? (
            <>
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
              <p>Here is the list of notifications</p>
              <ul>
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
                      type={notif.type}
                      value={valueProp}
                      html={htmlProp}
                    />
                  );
                })}
              </ul>
            </>
          ) : (
            <p>No new notification for now</p>
          )}
        </div>
      )}
    </>
  );
}

Notifications.propTypes = {
  displayDrawer: PropTypes.bool,
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
  notifications: [],
};

export default Notifications;
