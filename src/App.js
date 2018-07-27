import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Setup from './components/Setup';
import Settings from './components/Settings';
import Loading from './components/Loading';
import Contexts from './components/Contexts';
import PortForward from './components/PortForward';
import { getVersion } from './utils';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      version: null,
      showSettings: false,
      tab: 'context',
    };
  }

  componentWillMount() {
    getVersion()
      .then(({dataType, data}) => {
        this.setState({
          kubectlExists: true,
          version: data.version,
        });
      })
      .catch(({dataType, data}) => {
        this.setState({
          error: data,
        });
      });
  }

  changeTab(evt) {
    this.setState({
      tab: evt.target.attributes.getNamedItem('href').value.replace('#', ''),
    });
  }

  render() {
    const {
      version,
      error,
      showSettings,
      tab,
    } = this.state;
    let rtlClass = ''; // 'rtl'
    let tabs = null;
    let content = (
      <Loading />
    );

    if (version !== null) {
      if (tab === 'context') {
        content = (
          <Contexts />
        );
      } else if (tab === 'port-forwarding') {
        content = (
          <PortForward />
        );
      } else {
        content = (
          <div>...</div>
        );
      }
      tabs = (
        <ul className="tab tab-block">
          <li className="tab-item">
            <a
              href="#context"
              onClick={evt => this.changeTab(evt)}
              className={`${(tab === 'context' ? 'active' : '')}`}
            >
              Context
            </a>
          </li>
          <li className="tab-item">
            <a
              href="#port-forwarding"
              onClick={evt => this.changeTab(evt)}
              className={`${(tab === 'port-forwarding' ? 'active' : '')}`}
            >
              Port Forwarding
            </a>
          </li>
        </ul>
      );
    }
    if (error !== null) {
      content = (
        <Setup />
      );
      tabs = null;
    }

    return (
      <div className={`App ${rtlClass}`}>
        <Header />
        {tabs}
        {content}
        <Footer
          onHandleShowSettings={() => {
            this.setState({
              showSettings: true,
            });
          }}
        />
        <Settings active={showSettings} />
      </div>
    );
  }
}

export default App;
