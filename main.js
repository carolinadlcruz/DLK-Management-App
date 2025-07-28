const { app, BrowserWindow, screen } = require("electron/main");
const path = require("node:path");

function createWindow() {
  const mainScreen = screen.getPrimaryDisplay();
  const dimensions = mainScreen.size;

  const win = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    frame: false, // Esto quita los bordes y la barra de título
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
