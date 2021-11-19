const { contextBridge, ipcRenderer, clipboard, shell } = require('electron');
const Store = require('electron-store');

const schema = {
  classifications: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        icon: {
          type: 'number',
        },
        items: {
          type: 'array',
          items: { type: 'number' },
          default: [],
        },
        ships: {
          type: 'array',
          items: { type: 'number' },
          default: [],
        },
        weight: {
          type: 'number',
          default: 1,
        },
      },
    },
  },
};

const defaults = {
  classifications: [
    {
      name: 'cyno',
      items: [21096, 28646],
      weight: 10,
      icon: 21096,
    },
    {
      name: 'dictor',
      items: [22782],
      weight: 10,
      icon: 22782,
    },
  ],
};
const store = new Store({ schema, defaults, name: 'classifications' });

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
  store: {
    get(key) {
      return store.get(key);
    },
    set(key, value) {
      return store.set(value, key);
    },
  },
});
