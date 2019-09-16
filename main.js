const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

//disable dev tools
process.env.NODE_ENV = 'production';

let mainWindow;
let addItemsWindow;

//Listen for the app to be ready
app.on('ready', function () {
    //when ready, create new window
    mainWindow = new BrowserWindow({
        width: 1250,
        height: 800,
        //resizable: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    });
    
    // and load the index.html of the app.
    mainWindow.loadFile('src/index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
    
    //close all windows when main is closed
    mainWindow.on('closed', function(){
        app.quit();
    });
    
    //Bild menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert manu
    Menu.setApplicationMenu(null);

    //setting notification api
    if (process.platform === 'win32') {      
      app.setAppUserModelId("com.ikobit.desktop-notifications");
      //app.setAppUserModelId(process.execPath);
    }
    app.setAppUserModelId(process.execPath)
});

//Adding new window
function createAddWindow(){
    addItemsWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add new items',
        webPreferences: {
            nodeIntegration: true
        }
    });
    //Load html file into the window
    addItemsWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //for garbage collector
    addItemsWindow.on('close', function(){
        addItemsWindow = null;
    });

}

//Create manu template
const mainMenuTemplate = [];


ipcMain.on('login:user', function(event, user){
    console.log(user);
    //load user's homepage
    mainWindow.loadFile('src/homepage.html')
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('user', user);
    });
});

ipcMain.on('register:user', function(event, user){
    console.log(user);
    //load user's homepage
    mainWindow.loadFile('src/homepage.html')
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('user', user);
    });
});

ipcMain.on('logout', function(event, dummy){
    //load index homepage
    mainWindow.loadFile('src/index.html');
});



if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle dev tools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}