const { contextBridge, ipcRenderer, clipboard, shell } = require('electron');

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
  shell: {
    openExternal(url) {
      shell.openExternal(url);
    },
  },
  clipboard: {
    readText() {
      return clipboard.readText();
    },
  },
});
