import { memo } from 'react'
import PropTypes from 'prop-types'

const NotificationItem = memo(function NotificationItem({
  type,
  html,
  value,
  markAsRead,
  id,
}) {
  const notificationType = type ?? 'default'
  const handleClick = () => {
    if (markAsRead) markAsRead(id ?? 0)
  }
  const colorClass =
    notificationType === 'urgent'
      ? 'text-[var(--urgent-notification-item)]'
      : 'text-[var(--default-notification-item)]'
  const itemClass = `${colorClass} max-[912px]:w-full max-[912px]:border-b max-[912px]:border-gray-500 max-[912px]:text-[20px] max-[912px]:p-3 max-[912px]:list-none cursor-pointer`

  if (html) {
    return (
      <li
        data-notification-type={notificationType}
        className={itemClass}
        onClick={handleClick}
        dangerouslySetInnerHTML={html}
      />
    )
  }

  return (
    <li
      data-notification-type={notificationType}
      className={itemClass}
      onClick={handleClick}
    >
      {value}
    </li>
  )
})

NotificationItem.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  html: PropTypes.shape({
    __html: PropTypes.string,
  }),
  value: PropTypes.string,
  markAsRead: PropTypes.func,
}

export default NotificationItem
