/*
FirebaseUtils provides connection to firebase's real time database.
It contains utils methods for reading/writing to database 
*/

class FirebaseUtils{
    static databaseUrl = 'https://handyman-react.firebaseio.com/';
    
    static async getAllUsers() {
      try {
        let response = await fetch(
          'https://handyman-react.firebaseio.com/users.json',
        );
        let responseJson = await response.json();
        let users = [];
        for(let key in responseJson){
          users.push(responseJson[key])
        }
        return users
      } catch (error) {
        console.error(error);
      }
    }
    
    static async getUserByName(username){
      const users = await FirebaseUtils.getAllUsers();
      const userExists = users.some(users => users.username == username);
      if(userExists){
          return users.find(users => users.username === username);
      }
      else{
          return null;
      }
    }

    static async getUserByType(type){
      const users = await FirebaseUtils.getAllUsers();
      const userExists = users.some(users => users.type == type);
      if(userExists){
          let requesteUsers = [];
          for(let user of users){
            if(user.type == type){
              requesteUsers.push(user)
            }
          }
          return requesteUsers;
      }
      else{
          return null;
      }
    }

    static createNewUser(username, password, firstName, lastName, number, address, type){
      fetch("https://handyman-react.firebaseio.com/users.json", {
        method: "POST",
        body: JSON.stringify({
          'username': username,
          'password': password,
          'firstName': firstName,
          'lastName': lastName,
          'number': number,
          'address': address,
          'type': type,
          'rating': '',
          'jobsDone': '',
          'commentsNumber':'0',
          'wage':'',
          'speciality':''
        })
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    static async getAllComments() {
      try {
        const response = await fetch(
          'https://handyman-react.firebaseio.com/comments.json',
        );
        const responseJson = await response.json();
        let comments = [];
          for(let key in responseJson){
            comments.push(responseJson[key])
          }
          return comments
      } catch (error) {
        console.error(error);
      }
    }
  
    static async getCommentsForHandyman(handyman){
      const comments = await FirebaseUtils.getAllComments();
      const commentsExists = comments.some(comments => comments.handyman == handyman);
      if(commentsExists){
        let requesteComments = [];
        for(let comment of comments){
          if(comment.handyman == handyman){
            requesteComments.push(comment)
          }
        }
        return requesteComments;
      }
      else{
          return null;
      }
    }

    static async getUserFirebaseID(username){
      try {
        let response = await fetch(
          'https://handyman-react.firebaseio.com/users.json',
        );
        let responseJson = await response.json();
        for(let key in responseJson){
          if(responseJson[key].username == username){
            return key;
          }
        }
        return users
      } catch (error) {
        console.error(error);
      }
    }
  
    static async updateUser(newUserData){
      const key = await FirebaseUtils.getUserFirebaseID(newUserData.username);
      fetch("https://handyman-react.firebaseio.com/users/" + key + ".json", {
        method: "PATCH",
        body: JSON.stringify(newUserData)
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    static async getAllRequests() {
      try {
        const response = await fetch(
          'https://handyman-react.firebaseio.com/requests.json',
        );
        const responseJson = await response.json();
        let requests = [];
          for(let key in responseJson){
            requests.push(responseJson[key])
          }
          return requests
      } catch (error) {
        console.error(error);
      }
    }
    
    static async getRequestsForUser(username){
      const allRequests = await FirebaseUtils.getAllRequests();
      const requestsExist = allRequests.some(request => request.user == username);
      if(requestsExist){
        let requests = [];
        for(let key in allRequests){
          if(allRequests[key].user == username){
            requests.push(allRequests[key]);
          }
        }
        return requests
      }
      else{
          return null;
      }
    }

    static async createNewComment(user, handyman, text){
      fetch("https://handyman-react.firebaseio.com/comments.json", {
        method: "POST",
        body: JSON.stringify({
          'user': user,
          'handyman': handyman,
          'text': text
        })
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    static async createNewHandymanRequest(user, handyman, status, startDate, endDate, urgent, address, number, payment){
      const requests = await FirebaseUtils.getAllRequests();
      var id = requests.length + 1;
      fetch("https://handyman-react.firebaseio.com/requests.json", {
        method: "POST",
        body: JSON.stringify({
          'id': id,
          'user': user,
          'handyman': handyman,
          'status': status,
          'startDate': startDate,
          'endDate': endDate,
          'urgent': urgent,
          'address': address,
          'number': number,
          'payment': payment,
          'latitude': 44.7999281,
          'longitude': 20.4080255
        })
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    static async getRequestsForHandyman(handymanUsername){
      allRequests = await FirebaseUtils.getAllRequests();
      const requestsExist = allRequests.some(request => request.handyman == handymanUsername);
      if(requestsExist){
        requests = [];
        for(key in allRequests){
          requests.push(allRequests[key]);
        }
        return requests
      }
      else{
          return null;
      }
    }
  
    static async getRequestFirebaseID(requestID){
      try {
        let response = await fetch(
          'https://handyman-react.firebaseio.com/requests.json',
        );
        let responseJson = await response.json();
        for(key in responseJson){
          if(responseJson[key].id == requestID){
            return key;
          }
        }
        return users
      } catch (error) {
        console.error(error);
      }
    }
  
    //getRequestFirebaseID(10);
  
    static async updateRequest(newRequestData){
      key = await FirebaseUtils.getRequestFirebaseID(newRequestData.id);
      fetch("https://handyman-react.firebaseio.com/requests/" + key + '.json', {
        method: "PATCH",
        body: JSON.stringify(newRequestData)
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

  }

/*
fetch("https://handyman-react.firebaseio.com/users.json", {
          method: "POST",
          body: JSON.stringify({
            'username': 'isi',
            'password': 'test01'
          })
        })
          .then(res => console.log(res))
          .catch(err => console.log(err));
*/

module.exports = FirebaseUtils;