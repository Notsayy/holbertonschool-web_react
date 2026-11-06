import { Component } from 'react';
import PropTypes from 'prop-types';
import BodySection from '../BodySection/BodySection';

class BodySectionWithMarginBottom extends Component {
  render() {
    return (
      <div className="bodySectionWithMargin mb-10">
        <BodySection {...this.props} />
      </div>
    );
  }
}

BodySectionWithMarginBottom.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

BodySectionWithMarginBottom.defaultProps = {
  title: '',
  children: null,
};

export default BodySectionWithMarginBottom;

