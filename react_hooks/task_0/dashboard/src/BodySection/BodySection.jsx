import { Component } from 'react';
import PropTypes from 'prop-types';

class BodySection extends Component {
  render() {
    const { title, children } = this.props;

    return (
      <div className="bodySection my-5">
        <h2 className="text-xl font-bold mb-3">{title}</h2>
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
