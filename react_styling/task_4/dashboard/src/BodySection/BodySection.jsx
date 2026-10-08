import { Component } from 'react';
import PropTypes from 'prop-types';

class BodySection extends Component {
  render() {
    const { title, children } = this.props;

    return (
      <div className="bodySection my-5 pb-5 border-b-2 border-[var(--main-color)]">
        <h2 className="text-xl font-bold mb-3 max-[520px]:text-lg">{title}</h2>
        {children}
      </div>
    );
  }
}

BodySection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

BodySection.defaultProps = {
  title: '',
  children: null,
};

export default BodySection;
