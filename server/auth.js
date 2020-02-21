
state.users = state.users || []

var usersList = state.users;
state.sessions = state.sessions || {}

var sessionsList = state.sessions

exports.usersList = usersList
exports.sessionsList = sessionsList

usersList.push({"username" : "username", "password": "password"})

function findUser(username){
    var user = _.find(usersList, { 'username': username });
    return user;
}

function returnError(res, code, message){
    return res.json(code, { error: { 'message': message } });
}

function guid() {
    var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
}

//drop in authentication function for any route, will fail an invalid request, and return the user for a valid one
function authenticateSession(req, res){
    var sessionId = (req.cookies) ? req.cookies.sessionId : undefined
    if(sessionId === undefined || sessionId.length === 0 || sessionsList[sessionId] === undefined || sessionsList[sessionId].length === 0){
      console.log("Failing Unauthenticated user")
      returnError(res, 401, "Unauthenticated User")
      return undefined
    }

    console.log("Authenticated user - " + sessionId)
    return findUser(sessionsList[sessionId])
}

exports.findUser = findUser
exports.returnError = returnError
exports.authenticateSession = authenticateSession
exports.guid = guid

