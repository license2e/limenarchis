'use strict';
const dgram = require('dgram');
const i18n = require('../../src/i18n');
const electron = require('electron');
const { app } = electron;
const Kubectl = require('../lib/kubectl');

// instantiate the local variables
const kubectl = new Kubectl();
const args = JSON.parse(Buffer(process.argv[2].toString('binary'), 'base64'));
let services = [];

const startServer = () => {
  const server = dgram.createSocket('udp4');

  server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    const data = JSON.parse(msg);
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    if (data.command === 'ping') {
      const message = Buffer.from(JSON.stringify({response: 'pong'}));
      server.send(message, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(err);
        }
      });
    } else if (data.command === 'start') {
      try {
        services = kubectl.portForward(data.svcs);
      } catch (err) {
        console.error(err);
      }
    } else if (data.command === 'shutdown') {
      setTimeout(() => {
        const message = Buffer.from(JSON.stringify({response: 'Ok :_('}));
        server.send(message, rinfo.port, rinfo.address, (err) => {
          if (err) {
            console.error(`Error during shutdown: ${err}`);
          }
          if (services.length > 0) {
            services.forEach(pf => {
              console.log(`[${pf.pid}] Stoping service process`);
              pf.kill();
            });
          }
          server.close();
          process.exit(0);
        });
      }, 10);
    }
  });

  // log the server listening event
  server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });

  // get the port number from the settings then start the server
  server.bind(parseInt(args.port));
};

// TODO: Use electron-builder to remove the icon variables
// "mac": {
//   "extendInfo": {
//     "LSUIElement": 1
//   }
// }
app.dock.hide();
app.on('ready', () => {
  startServer();
});
app.on('before-quit', () => {
  if (services.length > 0) {
    services.forEach(pf => {
      console.log(`[${pf.pid}] Stoping service process`);
      pf.kill();
    });
  }
});
