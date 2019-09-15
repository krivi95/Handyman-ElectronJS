const electron = require('electron');
remote = electron.remote;
const {ipcRenderer} = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const FirebaseUtils = require('../firebase/FirebaseUtils.js')

window.onload = initializeHandymenCollection;

const searchButton = document.getElementById('search');
const logoutButton = document.getElementById('logout');
const accountButton = document.getElementById('account');
const repairsButton = document.getElementById('repairs');

//getting user info sent from login/register page
var user = null;
ipcRenderer.on('user', function(e, userData){
    user = userData;
});

searchButton.addEventListener('click', initializeHandymenCollection);

logoutButton.addEventListener('click', function(event){
    const modelPath = path.join('file://', __dirname, 'logoutWindow.html');
    let logoutWindow = new BrowserWindow({
        alwaysOnTop: true,
        resizable: false,
        //frame: false,
        width: 300, 
        height: 200,
        webPreferences: {
            nodeIntegration: true
        }
    });
    logoutWindow.on('close', function(){logoutWindow = null;});
    logoutWindow.loadURL(modelPath);
    logoutWindow.show();
});

accountButton.addEventListener('click', function(event){
    const modelPath = path.join('file://', __dirname, 'account.html');
    let accountWindow = new BrowserWindow({
        alwaysOnTop: true,
        resizable: false,
        //frame: false,
        width: 550, 
        height: 650,
        webPreferences: {
            nodeIntegration: true
        }
    });    
    accountWindow.webContents.on('did-finish-load', () => {
        accountWindow.webContents.send('user', user);
    });
    accountWindow.on('close', function(){accountWindow = null;});
    accountWindow.loadURL(modelPath);
    accountWindow.show();
});

repairsButton.addEventListener('click', function(event){
    const modelPath = path.join('file://', __dirname, 'repairs.html');
    let repairsWindow = new BrowserWindow({
        alwaysOnTop: true,
        //resizable: false,
        //frame: false,
        width: 510, 
        height: 650,
        webPreferences: {
            nodeIntegration: true
        }
    });    
    repairsWindow.webContents.on('did-finish-load', () => {
        repairsWindow.webContents.send('user', user);
    });
    repairsWindow.on('close', function(){repairsWindow = null;});
    repairsWindow.loadURL(modelPath);
    repairsWindow.show();
});

function filterHandymenBasedOnSearchFilter(handymen){
    var filteredHandymen = handymen;
    const speciality = document.getElementById('type').value;
    var jobsDone = document.getElementById('jobsDone').value;
    var wage = document.getElementById('wage').value;
    jobsDone = parseInt(jobsDone, 10);
    wage = parseInt(wage, 10);
    if(speciality != 'all'){
        filteredHandymen = handymen.filter(function(handyman, index){
            return handyman.speciality == speciality;
        });
    }
    if(jobsDone != 0){
        filteredHandymen = filteredHandymen.filter(function(handyman, index){
            return handyman.jobsDone >= jobsDone;
        });
    }
    if(wage != 0){
        filteredHandymen = filteredHandymen.filter(function(handyman, index){
            return handyman.wage <= wage;
        });
    }
    return filteredHandymen;
}

var allHandyman = null;

async function initializeHandymenCollection(){
    //clearing div container for handymen cards
    var handymenHTMLContainer = document.getElementById('handymen');
    while (handymenHTMLContainer.firstChild) {
        handymenHTMLContainer.removeChild(handymenHTMLContainer.firstChild);
      }
    //removing spinnner at first load
    const spinner = document.getElementById('spinner');
    if (spinner != null){
        spinner.remove();
    }
    //getting handyman
    var handymen = null;
    if(allHandyman == null){
        handymen = await FirebaseUtils.getUserByType('handyman');
        allHandyman = handymen;
    }
    else{
        handymen = allHandyman;
    }
    //filtering handymen if search conditions are applied
    handymen = filterHandymenBasedOnSearchFilter(handymen)
    let rowNumber = 0
    let numberOfElementsInRow = 0
    for(let handyman of handymen){
        //Every row has 4 handymen div elements
        //For each 4 handymen adding new row div
        if(numberOfElementsInRow == 0){
            handymenHTMLContainer.innerHTML += `<div id="row${rowNumber}" class="row"></div>`    
        }
        //handyman card element//e0e0e0 grey lighten-2
        const handymanDIV = `
            <div class="col s3">
              <div id="${handyman.username}" class="card hoverable grey lighten-1 waves-effect waves-block waves-light" style=" border: 0.5px solid grey; border-radius: 10px;">
                <div class="card-content white-text">
                  <span class="card-title">${handyman.username}</span>
                  <hr>
                  <p>Speciality: ${handyman.speciality}</p>
                  <p>Rating: ${handyman.rating}/5</p>
                  <p>Jobs done: ${handyman.jobsDone}</p>
                  <p>Comments: ${handyman.commentsNumber}</p>
                </div>
              </div>
            </div>
        `;
        //appending handyman card to row
        document.getElementById('row' + rowNumber).innerHTML += handymanDIV;
        numberOfElementsInRow += 1
        //checking the number of handyman cords in row
        if(numberOfElementsInRow == 4){
            numberOfElementsInRow = 0;
            rowNumber += 1;
        }
    }
}

document.getElementById('handymen').addEventListener('click', function(event) {
    /*
    Handyman cards are added dinamically so event listeners cannot be added.
    Insted global evenet listener on html dive lement wher handymen are storred.
    Checking if id of one html element on path corresponds to username and creating new window for it,
    */
    const path = event.path;
    for(let element of path){
        id = element.id;
        if(id == null){
            continue;
        }
        if(id != '' && id != 'handymen' && !id.startsWith('row')){
            createhandymanDetailsWindow();
            break;
        }
    }

  });

function createhandymanDetailsWindow(event){
    const modelPath = path.join('file://', __dirname, 'handymanView.html');
    let handymanViewWindow = new BrowserWindow({
        alwaysOnTop: true,
        //resizable: false,
        //frame: false,
        width: 650, 
        height: 750,
        webPreferences: {
            nodeIntegration: true
        }
    });
    handymanViewWindow.webContents.on('did-finish-load', () => {
        handymanViewWindow.webContents.send('handymanUsername', id, user);
    });
    handymanViewWindow.on('close', function(){handymanViewWindow = null;});
    handymanViewWindow.loadURL(modelPath);
    handymanViewWindow.show();
}
