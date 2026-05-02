const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { fork } = require('child_process');

let mainWindow;
let serverProcess;

function startServer() {
  // En production, on lance dist/server.cjs. En dev, on pourrait utiliser tsx.
  const serverPath = isDev 
    ? path.join(__dirname, 'server.ts') 
    : path.join(__dirname, 'dist', 'server.cjs');

  if (isDev) {
    // En dev, on utilise tsx pour lancer server.ts
    serverProcess = fork(
      path.join(__dirname, 'node_modules', 'tsx', 'dist', 'cli.mjs'), 
      ['server.ts'], 
      { env: { ...process.env, NODE_ENV: 'development' } }
    );
  } else {
    // En prod, on lance le bundle CJS
    serverProcess = fork(serverPath, { env: { ...process.env, NODE_ENV: 'production' } });
  }

  serverProcess.on('message', (msg) => {
    console.log('Server message:', msg);
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "MecaSoft Auto - Dashboard",
  });

  // On attend un peu que le serveur démarre
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 3000);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
