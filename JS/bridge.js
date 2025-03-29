const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveFlightDetails: (data) => ipcRenderer.send('save-flight-details', data),
    loadFlightDetails: () => ipcRenderer.invoke('load-flight-details'),
});
