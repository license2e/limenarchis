import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Loading from './Loading';
import { getContexts, useContext, saveSettings } from '../utils';
import gke from '../img/gke.svg';
import pencil from '../img/pencil.svg';

class Contexts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: null,
      contexts: null,
      currentContext: null,
      error: null,
      processing: false,
      edit: false,
      labels: {},
    };
  }

  componentWillMount() {
    getContexts()
      .then(({dataType, data}) => {
        this.setState({
          settings: data.settings,
          contexts: data.list,
          currentContext: data.current,
          error: null,
        });
      })
      .catch(({dataType, data}) => {
        this.setState({
          error: data,
        });
      });
  }

  saveContextNames() {
    const newSettings = this.state.settings;
    const newContexts = this.state.contexts;
    Object.keys(this.state.labels).forEach((name) => {
      newSettings.contexts[name] = Object.assign({}, newSettings.contexts[name], {
        label: this.state.labels[name],
      });
    });
    newContexts.forEach((context, idx) => {
      if ({}.hasOwnProperty.call(this.state.labels, context.name) === true) {
        if (this.state.labels[context.name] !== '') {
          newContexts[idx].label = this.state.labels[context.name];
        } else {
          delete newContexts[idx].label;
        }
      }
    });
    this.setState({
      contexts: newContexts,
    }, () => {
      saveSettings(newSettings)
        .catch(({dataType, data}) => {
          this.setState({
            error: data,
          });
        });
    });
  }

  changeContext(name) {
    this.setState({
      currentContext: name,
      processing: true,
    }, () => {
      useContext(name)
        .then((res) => {
          this.setState({
            currentContext: res.data.current,
            processing: false,
          });
        })
        .catch((err) => {
          this.setState({
            error: err,
            processing: false,
          });
        });
    });
  }

  render () {
    const {
      contexts,
      currentContext,
      error,
      processing,
      edit,
      labels,
    } = this.state;

    let content = (
      <div className="columns">
        <div className="column col-12">
          <Loading />
        </div>
      </div>
    );
    let overlay = null;

    if (contexts !== null) {
      const contextList = [];
      contexts.forEach((item, idx) => {
        let logo = null;
        let project = null;
        let region = null;
        let primaryBtn = '';
        let disabledBtn = '';
        let label = item.name;

        // for gke, the context name follows a pattern
        if (edit === false && item.name.substr(0,3) === 'gke') {
          const nameArray = item.name.split('_');
          label = nameArray[nameArray.length-1];
          if (nameArray[0] === 'gke') {
            logo = gke;
            project = nameArray[1];
            region = nameArray[2];
          }
        } else if (edit === true) {
          label = '';
        }

        // override the label if present
        if (
          {}.hasOwnProperty.call(item, 'label') === true
          && item.label !== ''
        ) {
          label = item.label;
        }

        if (
          edit === true
          && {}.hasOwnProperty.call(labels, item.name) === true
        ) {
          label = labels[item.name];
        }

        if (edit === true) {
          contextList.push((
            <div key={`item-${idx}`} className="column col-12 context">
              <div class="form-group">
                <input
                  className="form-input"
                  type="text"
                  value={label}
                  placeholder={item.name}
                  onChange={(evt) => {
                    const newLabels = Object.assign({}, labels);
                    newLabels[item.name] = evt.target.value;
                    this.setState({
                      labels: newLabels,
                    });
                  }}
                />
              </div>
            </div>
          ));
          return;
        }

        // identify the current context
        if (currentContext === item.name) {
          primaryBtn = 'btn-primary';
        }
        if (processing === true) {
          disabledBtn = 'disabled';
        }

        // create the context list item
        contextList.push((
          <div key={`item-${idx}`} className="column col-12 context">
            <button
              className={`btn btn-lg btn-stretch ${primaryBtn} ${disabledBtn}`}
              onClick={() => {
                this.changeContext(item.name);
              }}
            >
              {(logo !== null) ? (
                <div className="logo-info">
                  <img src={logo} alt="logo" className="icon" />
                  {(project !== null) ? (
                    <span className="logo-desc">{project}</span>
                  ): null}
                  {(region !== null) ? (
                    <span className="logo-desc">{region}</span>
                  ): null}
                </div>
              ) : null}
              <span className="context-name">{label}</span>
            </button>
          </div>
        ));
      });

      content = (
        <div className="columns">
          {contextList}
        </div>
      );
    }

    if (error !== null) {
      content = (
        <div className="columns">
          <div className="column col-12">
            error: {error}
          </div>
        </div>
      )
    }

    if (processing === true) {
      overlay = (
        <div className="overlay loading loading-lg" />
      );
    }
    return (
      <section className="container">
        <div className="content-container">
          <div className="content-actions">
            <button
              className="btn"
              onClick={() => {
                this.setState({
                  edit: !edit,
                }, () => {
                  this.saveContextNames();
                });
              }}
            >
              <img src={pencil} alt="pencil" className="icon" />
            </button>
          </div>
          <div className="content scroll">
            {content}
          </div>
        </div>
        {overlay}
      </section>
    );
  }
}

export default Contexts;
