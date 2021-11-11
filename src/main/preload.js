const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(channel, func) {
      const validChannels = ['showtooltip', 'hidetooltip', 'copy'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = [];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    send(channel, ...args) {
      ipcRenderer.send(channel, ...args);
    },
    removeListener(channel, listener) {
      ipcRenderer.removeListener(channel, listener);
    },
  },
  clipboard: {
    readText() {
      return clipboard.readText();
    },
  },
});
