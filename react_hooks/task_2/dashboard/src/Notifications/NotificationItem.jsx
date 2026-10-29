import { memo } from 'react';
import PropTypes from 'prop-types';

function NotificationItem({
  type = 'default',
  html,
  value = '',
  markAsRead = () => {},
  id = 0,
}) {
  const textColor = type === 'urgent' ? 'text-[var(--urgent-notification-item)]' : 'text-[var(--default-notification-item)]';
  const itemClass = `${textColor} max-[912px]:w-full max-[912px]:border-b max-[912px]:border-gray-500 max-[912px]:text-[20px] max-[912px]:p-3 max-[912px]:list-none cursor-pointer`;

  if (html) {
    return (
      <li
        className={itemClass}
        data-notification-type={type}
        onClick={() => markAsRead(id)}
        dangerouslySetInnerHTML={html}
      />
    );
  }

  return (
    <li
      className={itemClass}
      data-notification-type={type}
      onClick={() => markAsRead(id)}
    >
      {value}
    </li>
  );
}

NotificationItem.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  html: PropTypes.shape({
    __html: PropTypes.string,
  }),
  value: PropTypes.string,
  markAsRead: PropTypes.func,
};

export default memo(NotificationItem);
