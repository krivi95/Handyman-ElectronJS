const electron = require('electron');
remote = electron.remote;
const {ipcRenderer} = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const FirebaseUtils = require('../firebase/FirebaseUtils.js')


//getting user info sent from login/register page
var user = null;
ipcRenderer.on('user', async function(e, userData){
    user = userData;
    const requests = await FirebaseUtils.getRequestsForUser(user.username);
    var requestsDIV = document.getElementById('requests');
    for(let request of requests){
        //color based on status
        var color = "black";
        if(request.status == "rejected" || request.status == "unsuccessful"){
            color = "red";
        }
        else if(request.status == "confirmed" || request.status == "successful"){
            color = "green";
        }
        var requestHTML = "" 
        if(request.status != "pending" && request.status != "confirmed" && request.status != "rejected"){
            //repair was finished, so it has buutton for leaving feedback and sharing
            requestHTML =`
                <div class="row">
                    <div class="card blue-grey lighten-3 waves-effect waves-block waves-light" style=" border: 0.5px solid grey; border-radius: 10px;">
                        <div class="card-content white-text">
                        <p><span style="font-weight: bold">Handyman: </span> <span>${request.handyman}</span></p>
                        <p><span style="font-weight: bold">Date: </span> <span">${request.startDate} - ${request.endDate}</span></p>
                        <p><span style="font-weight: bold">Status: </span> <span" style="font-weight: bold; color:${color}">${request.status}</span></p>
                        <hr>                   
                        <div class="input-field">        
                            <div id="feedback.facebook.${request.handyman}" class="col s4 hoverable">
                                <a class="waves-effect" style="color: #3b5998">
                                <img src="../assets/images/fb.png" class="circle">Share</a>
                            </div>        
                            <div id="feedback.twitter.${request.handyman}" class="col s4 hoverable">
                                <a class="waves-effect #38A1F3" >
                                <img src="../assets/images/twitter.png" class="circle">Share</a>
                            </div>        
                            <div id="feedback.rating.${request.handyman}" class=" hoverable col s4">
                                <a class="waves-effect" style="color: #535457">
                                <i class="material-icons">mode_comment</i>Comment</a>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
        else{
            //request still in process, cannont left feedbck untill it's finished
            requestHTML =`
                <div class="row">
                    <div class="card blue-grey lighten-3 waves-effect waves-block waves-light" style=" border: 0.5px solid grey; border-radius: 10px;">
                        <div class="card-content white-text">
                        <p><span style="font-weight: bold">Handyman: </span> <span>${request.handyman}</span></p>
                        <p><span style="font-weight: bold">Date: </span> <span>${request.startDate} - ${request.endDate}</span></p>
                        <p><span style="font-weight: bold">Status: </span> <span style="font-weight: bold; color:${color}">${request.status}</span></p>
                        </div>
                    </div>
                </div>
                `;
        }
        requestsDIV.innerHTML += requestHTML;
    }
});


document.getElementById('requests').addEventListener('click', function(event) {
    /*
    Handyman cards are added dinamically so event listeners cannot be added.
    Insted global evenet listener on html dive lement wher handymen are storred.
    Checking if id of one html element on path corresponds to username and creating new window for it,
    */
    const path = event.path;
    for(let element of path){
        id = element.id;
        console.log(id);
        if(id && !id.startsWith('requests')){
            feedbackInfo = id.split('.');
            const feedbackType = feedbackInfo[1];
            const handymanUsername = feedbackInfo[2];
            if(feedbackType == "facebook"){
                createShareSocialMediaWindow('shareFacebook.html')

            }
            else if(feedbackType == "twitter"){
                createShareSocialMediaWindow('shareTwitter.html')
            }
            if(feedbackType == "rating"){
                createFeedbackWindow('shareFeedback.html', handymanUsername)
            }
        }
    }
  });

  function createShareSocialMediaWindow(page){
    const modelPath = path.join('file://', __dirname, page);
    let socialMediaWindow = new BrowserWindow({
        alwaysOnTop: true,
        resizable: false,
        //frame: false,
        width: 350, 
        height: 350,
        webPreferences: {
            nodeIntegration: true
        }
    });
    socialMediaWindow.on('close', function(){socialMediaWindow = null;});
    socialMediaWindow.loadURL(modelPath);
    socialMediaWindow.show();
}

function createFeedbackWindow(page, handymanUsername){
    const modelPath = path.join('file://', __dirname, page);
    let feedbackWindow = new BrowserWindow({
        alwaysOnTop: true,
        //resizable: false,
        //frame: false,
        width: 350, 
        height: 400,
        webPreferences: {
            nodeIntegration: true
        }
    });
    feedbackWindow.webContents.on('did-finish-load', () => {
        feedbackWindow.webContents.send('data', user, handymanUsername);
    });
    feedbackWindow.on('close', function(){feedbackWindow = null;});
    feedbackWindow.loadURL(modelPath);
    feedbackWindow.show();
}
