const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
const filePath = path.join(__dirname, 'flightdetails.json'); // Save JSON in project root

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true // Allow communication with backend
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html')); // Load index.html first

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

// Quit app when all windows are closed (except macOS)
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

// Listen for "save-flight-details" event from renderer
ipcMain.on('save-flight-details', (event, flightData) => {
    fs.writeFileSync(filePath, JSON.stringify(flightData, null, 2), 'utf8');
    console.log("Flight details saved:", flightData);
});

// Listen for "load-flight-details" event from renderer
ipcMain.handle('load-flight-details', async () => {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return {}; // Return empty object if file does not exist
});

// Clear JSON file when "Return to Home" is clicked
ipcMain.on('clear-flight-details', () => {
    fs.writeFileSync(filePath, '{}', 'utf8');
    console.log("Flight details cleared.");
});
