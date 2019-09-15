const electron = require('electron');
const remote = electron.remote;
const {ipcRenderer} = require('electron');

const logoutButton = document.getElementById('yes');
const cancelButton = document.getElementById('no');

logoutButton.addEventListener('click', async function(event){
    event.preventDefault();
    ipcRenderer.send('logout', null);
    let window = remote.getCurrentWindow();
    window.close();
})

cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});