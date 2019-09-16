const electron = require('electron');
const path = require('path');
const remote = electron.remote;
const {ipcRenderer} = require('electron');
const FirebaseUtils = require('../firebase/FirebaseUtils.js')

const registerButton = document.getElementById('register');
const cancelButton = document.getElementById('cancel');

registerButton.addEventListener('click', async function(event){    
    const errorMessageBox = document.getElementById('errorMessage');
    errorMessageBox.innerHTML = "";
    const type = document.getElementById('type').value;
    if(type == 'handyman'){
        errorMessageBox.innerHTML = "Please use mobile app."
        return;
    }
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const number = document.getElementById('number').value;
    const address = document.getElementById('address').value;    
    if(username == "" || password == "" || firstName == "" || lastName == "" || number == "" || address == ""){
        errorMessageBox.innerHTML = "Please enter all information."
        return;
    }
    
    const user = await FirebaseUtils.getUserByName(username);
    if(user){
        errorMessageBox.innerHTML = "Username already taken."
        return;
    }
    FirebaseUtils.createNewUser(username, password, firstName, lastName, number, address, type);
    
    event.preventDefault();
    ipcRenderer.send('register:user', user);
    let window = remote.getCurrentWindow();
    window.close();
})



cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});