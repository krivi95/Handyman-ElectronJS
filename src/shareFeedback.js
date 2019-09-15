const electron = require('electron');
const remote = electron.remote;
const {ipcRenderer, Notification} = require('electron');
const FirebaseUtils = require('../firebase/FirebaseUtils.js')

const shareButton = document.getElementById('share');
const cancelButton = document.getElementById('cancel');

//getting user and handyman info sent from create request page
var user = null;
var handyman = null;
ipcRenderer.on('data', async function(event, loggedUserData, handymanUsername){
    user = loggedUserData;
    handyman = await FirebaseUtils.getUserByName(handymanUsername);
});

function basicNotification() {
    const notification = {
        title: 'Feedback',
        body: 'Successfuly left feedback for handyman.'
    }
    const myNotification = new window.Notification(notification.title, notification);
}

shareButton.addEventListener('click', function(event){
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerHTML = "";
    comment = document.getElementById('comment').value;
    if(!comment){
        errorMessage.innerHTML = "Please insert comment."
        return;
    }
    //storing new comment
    FirebaseUtils.createNewComment(user.username, handyman.username, comment);
    //updating number of comments
    commentsNumber = parseInt(handyman.commentsNumber, 10);
    commentsNumber += 1;
    handyman.commentsNumber = commentsNumber;
    FirebaseUtils.updateUser(handyman);
    basicNotification();
    //let window = remote.getCurrentWindow();
    //window.close();
})

cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});
