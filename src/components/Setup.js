import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { openExternalLink } from '../utils';

class Setup extends Component {
  render () {
    return (
      <div className="setup">
        <div className="empty">
          <div className="empty-icon">
            <i className="icon icon-3x icon-stop"></i>
          </div>
          <p className="empty-title h5">Missing <code>~/.kube/config</code> file</p>
          <p className="empty-subtitle">Please install <code>kubectl</code> using the link below.</p>
          <div className="empty-action">
            <button
              className="btn btn-link"
              onClick={() => {
                openExternalLink('https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl');
              }}
            >
              Instructions
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Setup;
