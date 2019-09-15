const electron = require('electron');
const path = require('path');
const {ipcRenderer} = require('electron');
const remote = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const FirebaseUtils = require('../firebase/FirebaseUtils.js')

var handymanUsername = null;
var handymen = null;
var loggedUser = null;

var cancelButton = document.getElementById('cancel');


//on initialization loading handyman's username sentfrom selected homepage card element
//fetching the dataa from database and filling in those data into the html page
//loggedUser if for chesking wheader create request button should be displayed or not
ipcRenderer.on('handymanUsername', async function(e, receivedUsername, receivedLoggedUser){
    loggedUser = receivedLoggedUser
    handymanUsername = receivedUsername;
    handymen = await FirebaseUtils.getUserByName(handymanUsername);
    const comments = await FirebaseUtils.getCommentsForHandyman(handymanUsername);
    //updating fields
    document.getElementById('handyman').textContent = handymen.username;
    document.getElementById('speciality').value = handymen.speciality;
    document.getElementById('name').value = handymen.firstName + ' ' + handymen.lastName;
    document.getElementById('number').value = handymen.number;
    document.getElementById('address').value = handymen.address;    
    document.getElementById('wage').textContent = handymen.wage;    
    document.getElementById('rating').textContent = handymen.rating + '/5';    
    document.getElementById('jobsDone').textContent = handymen.jobsDone;
    //creating comments
    const commentsDivElement = document.getElementById('comments');
    if(comments == null){
        commentHTML = `
                <div class="row center">
                    <div class="input-field col s15">
                        <div class="card hoverable grey lighten-1 waves-effect waves-block waves-light" style=" border: 0.5px solid grey; border-radius: 10px;">
                            <div class="card-content white-text">
                                <div class="chip left">
                                        <i class="material-icons">person</i>
                                        <span id="username"></span>
                                </div>
                                <br style="clear: both;">
                            <p id="comment">There are no comment for this user...</p>
                            </div>
                        </div>
                    </div>      
                </div>
            `
        commentsDivElement.innerHTML += commentHTML;
    }
    else{
        for(let comment of comments){            
            console.log(commentsDivElement);
            console.log(comment);
            commentHTML = `
                <div class="row center">
                    <div class="input-field col s15">
                        <div class="card hoverable grey lighten-1 waves-effect waves-block waves-light" style=" border: 0.5px solid grey; border-radius: 10px;">
                            <div class="card-content white-text">
                                <div class="chip left">
                                        <i class="material-icons">person</i>
                                        <span id="username">${comment.user}</span>
                                </div>
                                <br style="clear: both;">
                            <p id="comment">${comment.text}</p>
                            </div>
                        </div>
                    </div>      
                </div>
            `
            commentsDivElement.innerHTML += commentHTML;
        }
    }
    //displaying create button (not viewed until user is logged)
    if(loggedUser != null){
        const registerButton = document.getElementById('request');
        registerButton.style.display = 'inline-block';    
        registerButton.addEventListener('click', createRequestWindow);
        // registerButton.addEventListener('click', function(event){
        //     let window = remote.getCurrentWindow();
        //     window.loadFile('src/createRequest.html');
        //     window.webContents.on('did-finish-load', () => {
        //         window.webContents.send('handymanAndUser', handymen, loggedUser);
        //     });
        // });
    }
});


function createRequestWindow(event){
    const modelPath = path.join('file://', __dirname, 'createRequest.html');
    let requestWindow = new BrowserWindow({
        alwaysOnTop: true,
        //resizable: false,
        //frame: false,
        width: 650, 
        height: 750,
        webPreferences: {
            nodeIntegration: true
        }
    });
    requestWindow.webContents.on('did-finish-load', () => {
        requestWindow.webContents.send('handymanAndUser', handymen, loggedUser);
    });
    requestWindow.on('close', function(){requestWindow = null;});
    requestWindow.loadURL(modelPath);
    requestWindow.show();
}


cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});
