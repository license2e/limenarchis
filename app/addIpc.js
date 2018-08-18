const { ipcRenderer } = require('electron');

// https://gist.github.com/jed/982883
function uuid(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)}

window.uuid = uuid;
window.limenarchis = window.limenarchis || {};
window.ipc = {
  sendMessage (channel, args) {
    console.log('sendMessage', channel, args);
    const id = window.uuid();
    const receiver = `receiveMessage-${id}`;
    return new Promise((resolve, reject) => {
      ipcRenderer.once(receiver, (evt, dataType, data) => {
        console.log(receiver, dataType, data);
        if ({}.hasOwnProperty.call(window.limenarchis, dataType) === true) {
          const existingData = window.limenarchis[dataType];
          window.limenarchis[dataType] = Object.assign({}, existingData, data);
        } else {
          window.limenarchis[dataType] = data;
        }
        if (dataType !== 'error') {
          return resolve({dataType, data});
        }
        return reject({dataType, data});
      });
      ipcRenderer.send(channel, id, args);
    });
  },
};
