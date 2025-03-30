const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
const filePath = path.join(__dirname, 'flightdetails.json'); 

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true 
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html')); 

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        app.whenReady().then(() => {
            mainWindow = new BrowserWindow({
                width: 1200,
                height: 800,
                webPreferences: {
                    nodeIntegration: true
                }
            });

            mainWindow.loadFile(path.join(__dirname, 'index.html'));
        });
    }
});


ipcMain.on('save-flight-details', (event, flightData) => {
    fs.writeFileSync(filePath, JSON.stringify(flightData, null, 2), 'utf8');
    console.log("Flight details saved:", flightData);
});


ipcMain.handle('load-flight-details', async () => {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return {}; 
});


ipcMain.on('clear-flight-details', () => {
    fs.writeFileSync(filePath, '{}', 'utf8');
    console.log("Flight details cleared.");
});
