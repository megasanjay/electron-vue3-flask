import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["getAppPath"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      console.log(`Invalid channel: ${channel}`);
    }
  },
  on: (channel, func) => {
    let validChannels = ["getAppPathResponse"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    } else {
      console.log(`Invalid channel: ${channel}`);
    }
  },
});
