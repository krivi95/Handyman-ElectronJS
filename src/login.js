const electron = require('electron');
const remote = electron.remote;
const {ipcRenderer} = require('electron');
const FirebaseUtils = require('../firebase/FirebaseUtils.js')

const loginButton = document.getElementById('login');
const cancelButton = document.getElementById('cancel');

loginButton.addEventListener('click', async function(event){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;    
    const errorMessageBox = document.getElementById('errorMessage');
    if(username == "" || password == ""){
        errorMessageBox.innerHTML = "Please enter username and password."
        return;
    }
    const user = await FirebaseUtils.getUserByName(username);
    if(!user){
        errorMessageBox.innerHTML = "Wrong username or password."
        return;
    }
    if(user.type != "user"){
        errorMessageBox.innerHTML = "Please use mobile app."
        return;
    }
    if(user.password != password){
        errorMessageBox.innerHTML = "Wrong username or password."
        return;
    }
    event.preventDefault();
    ipcRenderer.send('login:user', user);
    let window = remote.getCurrentWindow();
    window.close();
})



cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});