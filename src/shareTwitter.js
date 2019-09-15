const electron = require('electron');
const remote = electron.remote;
const {ipcRenderer, Notification} = require('electron');

const tweetButton = document.getElementById('tweet');
const cancelButton = document.getElementById('cancel');

function basicNotification() {
    const notification = {
        title: 'Tweet',
        body: 'Successfuly tweeted to your network.'
    }
    const myNotification = new window.Notification(notification.title, notification);
}

tweetButton.addEventListener('click', function(event){
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerHTML = "";
    tweetMessage = document.getElementById('tweetMessage').value;
    if(!tweetMessage){
        errorMessage.innerHTML = "Please insert comment."
        return;
    }
    basicNotification();
    // let window = remote.getCurrentWindow();
    //window.close();
})

cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});
