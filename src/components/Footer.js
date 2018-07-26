import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cog from '../img/cog.svg';

class Footer extends Component {
  render () {
    return (
      <footer className="columns footer">
        <div className="column col-12">
          <button
            className="btn"
            onClick={() => {
              this.props.onHandleShowSettings();
            }}
          >
            <img src={cog} alt="cog" className="icon" />
          </button>
        </div>
      </footer>
    );
  }
}
Footer.propTypes = {
  onHandleShowSettings: PropTypes.func,
};
Footer.defaultProps = {
  onHandleShowSettings: () => {},
}

export default Footer;
