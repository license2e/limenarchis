import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { resizeWindow } from '../utils';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.active,
    });
  }

  render () {
    const {
      active,
    } = this.state;
    let activeCls = '';
    if (active) {
      activeCls = 'active';
    }

    return (
      <div className={`modal ${activeCls}`}>
        <a href="#close" className="modal-overlay" aria-label="Close"><span>Close</span></a>
        <div className="modal-container">
          <div className="modal-header">
            <a
              href="#close"
              className="btn btn-clear float-right"
              aria-label="Close"
              onClick={(evt) => {
                evt.preventDefault();
                this.setState({
                  active: false,
                });
              }}
            >
            </a>
            <div className="modal-title h5">Settings</div>
          </div>
          <div className="modal-body">
            <div className="columns">
              <div className="column col-3 text-left">
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    resizeWindow(480, 380)
                      .then((res) => { console.log(res) })
                      .catch((err) => { console.error(err) });
                  }}
                >
                  <span>sm</span>
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    resizeWindow(480, 580)
                      .then((res) => { console.log(res) })
                      .catch((err) => { console.error(err) });
                  }}
                >
                  <span>md</span>
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    resizeWindow(480, 780)
                      .then((res) => { console.log(res) })
                      .catch((err) => { console.error(err) });
                  }}
                >
                  <span>lg</span>
                </button>
              </div>
              <div className="column col-9 text-left">
                Resize the view
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Settings.propTypes = {
  active: PropTypes.bool,
};
Settings.defaultProps = {
  active: false,
};

export default Settings;
