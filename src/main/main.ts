/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import iohook from 'iohook';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let tooltip: BrowserWindow | null = null;
ipcMain.on('close', () => mainWindow?.close());
ipcMain.on('toggle', () =>
  mainWindow?.isMaximized() ? mainWindow?.unmaximize() : mainWindow?.maximize()
);
ipcMain.on('minimize', () => mainWindow?.minimize());

ipcMain.on('showtooltip', (_event, { top, left, width, height, content }) => {
  const [x, y] = mainWindow?.getPosition() || [0, 0];
  tooltip?.webContents.send('showtooltip', {
    width,
    height,
    content,
    top: top + y,
    left: left + x,
  });
});

ipcMain.on('hidetooltip', (_event, ...args) => {
  tooltip?.webContents.send('hidetooltip', ...args);
});

// move window logic
const initialPos: { x: number; y: number } = {
  x: 0,
  y: 0,
};
let dragging = false;
iohook.on('mousedrag', (currentPos: any) => {
  if (dragging)
    mainWindow?.setPosition(
      currentPos.x - initialPos.x,
      currentPos.y - initialPos.y
    );
});
iohook.on('mouseup', (event: any) => {
  if (event.button === 1) dragging = false;
});
iohook.start();
ipcMain.on('drag', async (_event) => {
  if (!dragging) {
    const windowX = mainWindow?.getPosition()[0];
    const windowY = mainWindow?.getPosition()[1];
    if (windowX !== undefined && windowY !== undefined) {
      const { x, y } = screen.getCursorScreenPoint();
      initialPos.x = x - windowX;
      initialPos.y = y - windowY;
      dragging = true;
    }
  }
});
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 400,
    height: 300,
    minWidth: 270,
    minHeight: 100,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
    transparent: true,
  });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // mainWindow.webContents.openDevTools({ mode: 'undocked' });
  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  tooltip = new BrowserWindow({
    show: true,
    focusable: false,
    frame: false,
    transparent: true,
    parent: mainWindow || undefined,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  tooltip.setIgnoreMouseEvents(true);
  tooltip.setFullScreen(true);
  tooltip.loadURL('http://localhost:1212/#/tooltip');
  tooltip.show();
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => createWindow());
