const electron = require('electron');
remote = electron.remote;
const {ipcRenderer, Notification} = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const FirebaseUtils = require('../firebase/FirebaseUtils.js');

//getting user info delegated from login/register and homepage and updating the form fields
var user = null;
ipcRenderer.on('user', async function(e, userData){
    //fetching user data from database so once window has been opened again it will show updated data
    user = await FirebaseUtils.getUserByName(userData.username);
    //user = userData;
    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('number').value = user.number;
    document.getElementById('address').value = user.address;
});

const cancelButton = document.getElementById('cancel');
const saveButton = document.getElementById('save');

cancelButton.addEventListener('click', function(event){
    let window = remote.getCurrentWindow();
    window.close();
});

function basicNotification() {
    const notification = {
        title: 'Saved changes',
        body: 'Your acchound has been saved.'
    }
    const myNotification = new window.Notification(notification.title, notification);
}

saveButton.addEventListener('click', function(event){
    var newUserData = user;
    firstName = document.getElementById('firstName').value;
    lastName = document.getElementById('lastName').value;
    number = document.getElementById('number').value;
    address = document.getElementById('address').value;
    oldPassword = document.getElementById('oldPassword').value;
    newPassword = document.getElementById('newPassword').value;
    repeatedPassword = document.getElementById('repeatedPassword').value;  
    updateDataFlag = shouldUpdateUserData(firstName, lastName, number, address);
    updatePasswordFlag = shouldChangePassword(newUserData.password, oldPassword, newPassword, repeatedPassword); 
    if(updateDataFlag){
        newUserData = updateUserData(newUserData, firstName, lastName, number, address);
    } 
    if(updatePasswordFlag){
        newUserData = updatePassword(newUserData, newPassword);
    }
    if(updateDataFlag || updatePasswordFlag){
        basicNotification();
        FirebaseUtils.updateUser(newUserData);
        console.log(newUserData);
    }

});

function shouldUpdateUserData(firstName, lastName, number, address){
    if(!firstName || !lastName || !number || !address){        
        const errorMessageBox = document.getElementById('errorMessage');
        errorMessageBox.innerHTML = "Please don't leave any of the fields empety."
        return false;
    }
    return true;
}

function updateUserData(newUserData, firstName, lastName, number, address){
    newUserData.firstName = firstName;
    newUserData.lastName = lastName;
    newUserData.number = number;
    newUserData.address = address;
    return newUserData;
}

function shouldChangePassword(userPassword, oldPassword, newPassword, repeatedPassword){    
    const errorMessageBox = document.getElementById('errorMessage');
    if(!oldPassword && !newPassword && !repeatedPassword){
        return false;
    }
    if(oldPassword && newPassword && repeatedPassword){
        if(oldPassword != userPassword){
            errorMessageBox.innerHTML = "Please insert correct old password.";
            return false;
        }
        if(newPassword != repeatedPassword){
            errorMessageBox.innerHTML = "Please insert correct new password twice.";
            return false;
        }
        errorMessageBox.innerHTML = ""
        return true;
    }
    errorMessageBox.innerHTML = "Please insert old and new password."    
}

function updatePassword(newUserData, newPassword){  
    newUserData.password = newPassword;
    return newUserData;
}


