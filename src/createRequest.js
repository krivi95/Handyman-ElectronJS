const electron = require('electron');
const {ipcRenderer} = require('electron');
const path = require('path');
const remote = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const FirebaseUtils = require('../firebase/FirebaseUtils.js')


var cancelButton = document.getElementById('cancel');
var requestButton = document.getElementById('request');
var mapsButton = document.getElementById('maps');

var handymanData = null;
var userData = null;

//on initialization loading handyman's data and logged user data sent from selected homepage card element
ipcRenderer.on('handymanAndUser',function(event, handymen, loggedUser){
    //storing user and handyman data for creating request
    handymanData = handymen;
    userData = loggedUser;
    //updating fields
    document.getElementById('handyman').textContent = handymen.username;
    document.getElementById('speciality').value = handymen.speciality;
    document.getElementById('name').value = handymen.firstName + ' ' + handymen.lastName;
    document.getElementById('number').value = handymen.number;
    document.getElementById('address').value = handymen.address;    
    document.getElementById('wage').textContent = handymen.wage;    
    document.getElementById('rating').textContent = handymen.rating + '/5';    
    document.getElementById('jobsDone').textContent = handymen.jobsDone;
});


mapsButton.addEventListener('click', function(event){
    //opening maps window for choosing location
    const modelPath = path.join('file://', __dirname, 'maps.html');
    let mapsWindow = new BrowserWindow({
        alwaysOnTop: true,
        //resizable: false,
        //frame: false,
        width: 500, 
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mapsWindow.on('close', function(){mapsWindow = null;});
    mapsWindow.loadURL(modelPath);
    mapsWindow.show();
});

cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});

requestButton.addEventListener('click', async function(event){
    const errorMessageBox = document.getElementById('errorMessage');
    errorMessageBox.innerHTML = ""
    startDate = document.getElementById('requestStartDate').value;    
    endDate = document.getElementById('requestEndDate').value;    
    number = document.getElementById('requestNumber').value;    
    address = document.getElementById('requestAddress').value;    
    payment = document.getElementById('requestPaymentType').value;    
    urgent = document.getElementById('requestUrgent').value;
    if(!startDate || !endDate || !number || !address || !payment || !urgent){
        errorMessageBox.innerHTML = "Please insert all information."
        return;
    }
    await FirebaseUtils.createNewHandymanRequest(userData.username, handymanData.username, "pending", 
                                                startDate, endDate, urgent, address, number, payment)
    basicNotification()
});

function basicNotification() {
    const notification = {
        title: 'Request',
        body: 'Successfully created a new handyman request.'
    }
    const myNotification = new window.Notification(notification.title, notification);
}