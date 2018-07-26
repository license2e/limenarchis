import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Loading extends Component {
  render () {
    const {
      large,
    } = this.props;
    return (
      <div className={`loading${large ? ' loading-lg' : ''}`}></div>
    );
  }
}
Loading.propTypes = {
  large: PropTypes.bool,
};
Loading.defaultProps = {
  large: true,
};

export default Loading;
