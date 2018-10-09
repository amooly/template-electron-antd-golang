'use strict';

const {app, Menu, BrowserWindow} = require('electron');
const {spawn} = require('child_process');

// Keep a global reference of the window object, in order to prevent javascript garbage collection.
let mainWindow = null;
// Global variable to control whether the app should delete the mainWindow
let willQuitApp = false;
// golang background application
let golang = null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 900, height: 600});

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    var template = [{
        label: "SQL Generator",
        submenu: [
            {label: "About Application", selector: "orderFrontStandardAboutPanel:"},
            {type: "separator"},
            {
                label: "Quit", accelerator: "Command+Q", click: function () {
                    app.quit();
                }
            }
        ]
    }, {
        label: "Edit",
        submenu: [
            {label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
            {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
            {type: "separator"},
            {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
            {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
            {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
            {label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
        ]
    }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    // Open the DevTools.
    if (process.env.ENV === 'dev') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('close', (e) => {
        if (!willQuitApp) {
            e.preventDefault();
            mainWindow.hide();
        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function createSpawn() {
    if (golang) {
        return;
    }

    if (process.env.ENV === 'dev') {
        golang = spawn('go', ['run', './src/biz/main.go']);
    } else {
        golang = spawn('./app/main')
    }

    golang.stdout.on('data', (data) => {
        console.log(`输出：${data}`);
    });

    golang.stderr.on('data', (data) => {
        console.log(`错误：${data}`);
    });

    golang.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
    });
}

app.on('ready', function () {
    createSpawn();
    createWindow();
});

app.on('activate', function () {
    console.log("windows activate");
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!mainWindow) {
        createWindow();
    } else if (mainWindow.isMinimized()) {
        mainWindow.restore();
    } else {
        mainWindow.show();
    }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    willQuitApp = true;
    if (golang) {
        golang.kill('SIGHUP');
    }
});