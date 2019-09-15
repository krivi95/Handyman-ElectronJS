const electron = require('electron');
const remote = electron.remote;
const {ipcRenderer, Notification} = require('electron');

const shareButton = document.getElementById('share');
const cancelButton = document.getElementById('cancel');

function basicNotification() {
    const notification = {
        title: 'Share',
        body: 'Successfuly shared to your network.'
    }
    const myNotification = new window.Notification(notification.title, notification);
}

shareButton.addEventListener('click', function(event){
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerHTML = "";
    post = document.getElementById('post').value;
    if(!post){
        errorMessage.innerHTML = "Please insert comment."
        return;
    }
    basicNotification();
    let window = remote.getCurrentWindow();
    //window.close();
})

cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});
