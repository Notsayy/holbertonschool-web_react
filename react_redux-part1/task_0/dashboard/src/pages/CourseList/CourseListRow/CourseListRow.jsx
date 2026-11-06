import PropTypes from 'prop-types';

function CourseListRow({ isHeader = false, textFirstCell = '', textSecondCell = null }) {
  const headerRowClass = 'bg-table-header/45';
  const dataRowClass = 'bg-table-rows/45';
  const cellClass = 'border border-gray-400';
  const tdClass = `${cellClass} pl-2`;

  if (isHeader) {
    if (textSecondCell === null) {
      return (
        <tr className={headerRowClass}>
          <th colSpan="2" className={cellClass}>{textFirstCell}</th>
        </tr>
      );
    }
    return (
      <tr className={headerRowClass}>
        <th className={cellClass}>{textFirstCell}</th>
        <th className={cellClass}>{textSecondCell}</th>
      </tr>
    );
  }

  return (
    <tr className={dataRowClass}>
      <td className={tdClass}>{textFirstCell}</td>
      <td className={tdClass}>{textSecondCell}</td>
    </tr>
  );
}

CourseListRow.propTypes = {
  isHeader: PropTypes.bool,
  textFirstCell: PropTypes.string.isRequired,
  textSecondCell: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CourseListRow;

