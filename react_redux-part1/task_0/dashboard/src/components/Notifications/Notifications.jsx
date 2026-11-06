import { memo } from 'react';
import PropTypes from 'prop-types';
import closeIcon from '../../assets/close-icon.png';
import NotificationItem from '../NotificationItem/NotificationItem';

function Notifications({
  displayDrawer = true,
  notifications = [],
  handleDisplayDrawer = () => {},
  handleHideDrawer = () => {},
  markNotificationAsRead = () => {},
}) {
  const notificationList = notifications || [];
  const isBouncing = notificationList.length > 0 && !displayDrawer;

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
            onClick={handleHideDrawer}
          >
            <img src={closeIcon} alt="close icon" width="10px" height="10px" />
          </button>
          {notificationList.length > 0 ? (
            <>
              <p className="max-[912px]:text-[20px]">Here is the list of notifications</p>
              <ul className="max-[912px]:list-none max-[912px]:p-0 max-[912px]:m-0">
                {notificationList.map((notif) => {
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
                      markAsRead={markNotificationAsRead}
                    />
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="max-[912px]:text-[20px]">No new notifications for now</p>
          )}
        </div>
      )}
    </>
  );
}

Notifications.propTypes = {
  displayDrawer: PropTypes.bool,
  handleDisplayDrawer: PropTypes.func,
  handleHideDrawer: PropTypes.func,
  markNotificationAsRead: PropTypes.func,
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

const arePropsEqual = (previousProps, nextProps) => (
  previousProps.displayDrawer === nextProps.displayDrawer
  && previousProps.notifications === nextProps.notifications
  && previousProps.handleDisplayDrawer === nextProps.handleDisplayDrawer
  && previousProps.handleHideDrawer === nextProps.handleHideDrawer
  && previousProps.markNotificationAsRead === nextProps.markNotificationAsRead
);

export default memo(Notifications, arePropsEqual);
