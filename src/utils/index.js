const i18n = require('../i18n');

const sendMessage = function sendMessage (channel, data) {
  if (window.ipc && window.ipc.sendMessage) {
    return window.ipc.sendMessage(channel, data);
  }
  return Promise.reject(i18n.errorIPCBridge);
}

export const openExternalLink = (link) => {
  return sendMessage('openExternalLink', link);
}

export const getContexts = () => {
  return sendMessage('getContexts');
}

export const useContext = (ctx) => {
  return sendMessage('useContext', ctx);
}

export const resizeWindow = (width, height) => {
  return sendMessage('resizeWindow', {width, height});
}

export const getVersion = () => {
  return sendMessage('getVersion');
}

export const saveSettings = (settings) => {
  return sendMessage('saveSettings', settings);
}

export const portForwardStart = () => {
  return sendMessage('portForwardStart');
}

export const portForwardServices = () => {
  return sendMessage('portForwardServices');
}

export const portForwardStop = () => {
  return sendMessage('portForwardStop');
}
