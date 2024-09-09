const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { dialog } = require('electron');

autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// 强制在开发环境下检查更新
if (process.env.NODE_ENV === 'development') {
  autoUpdater.forceDevUpdateConfig = true; // 允许在开发环境中使用更新配置
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // check update
  autoUpdater.checkForUpdatesAndNotify();



  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 监听更新事件
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
      type: 'info',
      title: '更新可用',
      message: '有新的版本，是否现在下载？',
      buttons: ['下载', '取消']
  }).then(result => {
      if (result.response === 0) {  // 用户点击了"下载"
          autoUpdater.downloadUpdate();
      }
  });
});

// 当没有可用更新时，提示用户已经是最新版本
autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox({
      type: 'info',
      title: '没有更新',
      message: '当前已经是最新版本。',
      buttons: ['好的']
  });
});

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
      type: 'info',
      title: '更新完成',
      message: '下载完成，应用即将退出并更新到新版本。',
      buttons: ['现在重启']
  }).then(() => {
      autoUpdater.quitAndInstall();
  });
});

// 处理更新错误
autoUpdater.on('error', (error) => {
  dialog.showMessageBox({
      type: 'error',
      title: '更新错误',
      message: `更新时发生错误: ${error}`,
      buttons: ['关闭']
  });
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
