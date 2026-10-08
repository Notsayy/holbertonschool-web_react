import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class NotificationItem extends PureComponent {
  render() {
    const { type, html, value, markAsRead, id } = this.props;
    const textColor = type === 'urgent' ? 'text-[var(--urgent-notification-item)]' : 'text-[var(--default-notification-item)]';
    const itemClass = `${textColor} max-[912px]:w-full max-[912px]:border-b max-[912px]:border-gray-500 max-[912px]:text-[20px] max-[912px]:py-2.5 max-[912px]:px-2 max-[912px]:list-none cursor-pointer`;

    if (html) {
      return (
        <li
          className={itemClass}
          data-notification-type={type}
          dangerouslySetInnerHTML={html}
          onClick={() => markAsRead(id)}
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

NotificationItem.defaultProps = {
  id: 0,
  type: 'default',
  html: undefined,
  value: '',
  markAsRead: () => {},
};

export default NotificationItem;
