const electron = require('electron');
const {ipcRenderer} = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const FirebaseUtils = require('../firebase/FirebaseUtils.js')

window.onload = initializeHandymenCollection;

const searchButton = document.getElementById('search');
const loginButton = document.getElementById('login');
const registerButton = document.getElementById('register');

searchButton.addEventListener('click', initializeHandymenCollection);

loginButton.addEventListener('click', function(event){
    const modelPath = path.join('file://', __dirname, 'login.html');
    let loginWindow = new BrowserWindow({
        alwaysOnTop: true,
        resizable: false,
        //frame: false,
        width: 300, 
        height: 350,
        webPreferences: {
            nodeIntegration: true
        }
    });
    loginWindow.on('close', function(){loginWindow = null;});
    loginWindow.loadURL(modelPath);
    loginWindow.show();
});

registerButton.addEventListener('click', function(event){
    const modelPath = path.join('file://', __dirname, 'register.html');
    let registerWindow = new BrowserWindow({
        alwaysOnTop: true,
        resizable: false,
        //frame: false,
        width: 450, 
        height: 550,
        webPreferences: {
            nodeIntegration: true
        }
    });
    registerWindow.on('close', function(){registerWindow = null;});
    registerWindow.loadURL(modelPath);
    registerWindow.show();
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
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });
    handymanViewWindow.webContents.on('did-finish-load', () => {
        handymanViewWindow.webContents.send('handymanUsername', id);
    });
    handymanViewWindow.on('close', function(){handymanViewWindow = null;});
    handymanViewWindow.loadURL(modelPath);
    handymanViewWindow.show();
}