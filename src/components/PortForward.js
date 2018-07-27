import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Loading from './Loading';
import {
  portForwardStart,
  portForwardServices,
  portForwardStop,
} from '../utils';
import powerSwitch from '../img/power-switch.svg';

class Contexts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      portForward: false,
    };
  }

  handlePortForward(evt) {
    portForwardServices()
      .then(({dataType, data}) => {
        this.setState({
          portForward: true,
        });
      })
      .catch(({dataType, data}) => {
        this.setState({
          portForward: true,
        });
      });
  }

  handleStartStop(evt) {
    if (this.state.started === true) {
      portForwardStop()
        .then(({dataType, data}) => {
          this.setState({
            started: false,
          });
        })
        .catch(({dataType, data}) => {
          this.setState({
            started: true,
          });
        });
    } else {
      portForwardStart()
        .then(({dataType, data}) => {
          this.setState({
            started: true,
          });
        })
        .catch(({dataType, data}) => {
          this.setState({
            started: false,
          });
        });
    }
  }

  render() {
    const {
      started,
    } = this.state;
    let content = (
      <div>
        <div>test: {started.toString()}</div>
        <button
          className="btn"
          onClick={() => {
            this.handlePortForward();
          }}
        >
          Port Forward
        </button>
      </div>
    );
    return (
      <section className="container">
        <div className="content-container">
          <div className="content-actions">
            <button
              className={`btn ${(started === true) ? 'btn-primary' : ''}`}
              onClick={() => {
                this.handleStartStop();
              }}
            >
              <img src={powerSwitch} alt="power switch" className="icon" />
            </button>
          </div>
          <div className="content scroll">
            {content}
          </div>
        </div>
      </section>
    );
  }
}

export default Contexts;
