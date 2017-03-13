var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var argv = require('yargs')
    .command('count', 'Count the lines in a file')
    .usage('Usage: $0 -p [integer]')
    .default("p", 80)
    .alias('p', 'port')
    .describe('p', 'Port to run server on')
    .help('h')
    .alias('h', 'help')
    .argv;

var users = [];
var modules = [];

var sampleUser = JSON.parse('{"isBeingListened":false,"mainServerID":"123.456.789:8080","name":"front door sensor","parameterData":[0],"id":"12345abcde","type":"sensormodule"}');
var sampleModule = JSON.parse('{"isBeingListened":false,"name":"john doe","id":"12345abcde","type":"guardian","logs":["log 1"],"notifications":["note 1"]}');

// sample setup
function WoOz_setup(){
    console.log("**NOTE:** STARTING WIZARD OF OZ DEMO");
    users.push(sampleUser);
    modules.push(sampleModule);
}

function findUser(fieldName, fieldData){
    for(u in users){
        var curUser = users[u];
        if(curUser[fieldName] == fieldData){
            return curUser;
        }
    }
    return null;
}

function addUser(user_obj){
    userBlacklist.add(user_obj);
    notifyAll("Added " + user_obj["name"] + " to the blacklist.");
}

function removeUser(user_obj){
    userBlacklist.add(user_obj);
    notifyAll("Added " + user_obj["name"] + " to the blacklist.");
}

function editUserData(user, newData){
    // var message = "";
    // var changedFields = [];
    // var fields = ["name", "type", "isBeingListened","logs","notifications"]; //fields that are possible to change
    // for(f in fields){
    //     var curField = fields[f];
    //     if(newData[curField] != undefined){
    //         user[curField] = newData[curField];
    //         changedFields.push(curField);
    //     }
    // }

    // //TODO:
    // for(f in changedFields){
    //     if(changedFields[f] == "name"){
    //         message += "Changed " + user["id"] + "'s name to be '" + user["name"] + "'.";
    //     }else if (changedFields[f] == "type")
    // }
    
}

function editUser(id, newData){
    var user = findUser('id', id);
    if(user == null){
        var result = {
            success: false,
            message: "User not found"
        };
        return result;
    }
    editUserData(user, newData);
}

// Create application/x-www-form-urlencoded parser
// Used in functions related to POST
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function(request,response){
    response.end("Welcome to the homepage.");
});

app.get('/listUsers', function(request,response){
    console.log("Received request for listUsers");
    response.end("this is the list users api call in the server");
});

app.get('/listUsers/:type', function(request,response){
    console.log("Received request for listUsers");
    response.end("this is the list users api call for type " + request.params.type + " in the server");
});

app.get('/listModules', function(request,response){
    console.log("Received request for listModules");
    response.end(JSON.stringify(modules));
});

app.get('/listModules/:type', function(request,response){
    console.log("Received request for listModules");
    response.end("this is the list modules api call for type " + request.params.type + " in the server");
});

app.post('/addModule', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var type = data.type.toLowerCase();
    var dummyResponse;
    if(type.equals("module")){
        console.log("TODO: add addModule functionality");
        dummyResponse = {
            response: true,
            message: "Added " + data.id + " to the module list."
        };
    }else{
        console.log("addModule: Invalid data type received");
        console.log(data);
        dummyResponse = {
            response: false,
            message: "Input type is not a module"
        };
    }
    response.end(dummyResponse);
    // response.end();
});

app.delete('/removeModule', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var type = data.type.toLowerCase();
    var dummyResponse;
    if(type.equals("module")){
        console.log("TODO: add removeModule functionality");
        dummyResponse = {
            response: true,
            message: "Removed " + data.id + " from the module list."
        };
    }else{
        console.log("removeModule: Invalid data type received");
        console.log(data);
        dummyResponse = {
            response: false,
            message: "Input type is not a module"
        };
    }
    response.end(dummyResponse);
    // response.end();
});

app.post('/editModule', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var type = data.type.toLowerCase();
    var dummyResponse;
    if(type.equals("module")){
        console.log("TODO: add editModule functionality");
        dummyResponse = {
            response: true,
            message: "Changed " + data.id + " values."
        };
    }else{
        console.log("editModule: Invalid data type received");
        console.log(data);
        dummyResponse = {
            response: false,
            message: "Input type is not a module"
        };
    }
    response.end(dummyResponse);
    // response.end();
});

var server = app.listen(argv["port"], function(){
    var host = server.address().address;
	var port = server.address().port;

    WoOz_setup();

	console.log("Server listening at http://%s:%s", host, port);  
});