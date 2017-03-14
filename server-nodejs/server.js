var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var argv = require('yargs')
    .usage('Usage: $0 -p [integer] -i [string of IP address]')
    .default("p", 80)
    .default("i", '127.0.0.1')
    .alias('p', 'port')
    .alias('i', 'ip').alias('i','ip-address')
    .describe('p', 'Port to run server on')
    .describe('i', 'IP Address to run server on')
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

// Create application/x-www-form-urlencoded parser
// Used in functions related to POST
var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '200mb',parameterLimit: 50000 });
app.use(urlencodedParser);
app.use(bodyParser.json({limit: '200mb'}));

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

app.get('/', function(request,response){
    response.end("Welcome to the homepage.");
});

app.get('/listUsers', function(request,response){
    response.end(JSON.stringify(users));
});

app.get('/listUsers/:type', function(request,response){
    console.log("TODO: add type search functionality for listUsers");
    response.end(JSON.stringify(users));
    // response.end("this is the list users api call for type " + request.params.type + " in the server");
});

//TODO: get better way of searching
function isUser(json_obj){
    return (json_obj["logs"] != undefined && json_obj["notifications"] != undefined);
}

app.post('/addUser', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var dummyResponse;
    if(isUser(data)){
        console.log("TODO: add addUser functionality");
        dummyResponse = {
            response: true,
            message: "Added " + data.id + " to the user list."
        };
    }else{
        console.log("addUser: Invalid data type received");
        console.log(data);
        dummyResponse = {
            response: false,
            message: "Input type is not a user"
        };
    }
    response.end(dummyResponse);
    // response.end();
});

app.delete('/removeUser', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var dummyResponse;
    if(isUser(data)){ 
        console.log("TODO: add removeUser functionality");
        dummyResponse = {
            response: true,
            message: "Removed " + data.id + " from the user list."
        };
    }else{
        console.log("removeUser: Invalid data type received");
        console.log(data);
        dummyResponse = {
            response: false,
            message: "Input type is not a user"
        };
    }
    response.end(dummyResponse);
    // response.end();
});

app.post('/editUser', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var dummyResponse;
    if(isUser(data)){
        console.log("TODO: add editUser functionality");
        dummyResponse = {
            response: true,
            message: "Changed " + data.id + " values."
        };
    }else{
        console.log("editUser: Invalid data type received");
        console.log(data);
        dummyResponse = {
            response: false,
            message: "Input type is not a user"
        };
    }
    response.end(dummyResponse);
    // response.end();
});



app.get('/listModules', function(request,response){
    response.end(JSON.stringify(modules));
});

app.get('/listModules/:type', function(request,response){
    console.log("TODO: add type search functionality for listModules");
    response.end(JSON.stringify(modules));
    // response.end("this is the list modules api call for type " + request.params.type + " in the server");
});

//TODO: get better way of searching
function isModule(json_obj){
    return (json_obj.type != undefined &&
        json_obj.type.toLowerCase().search("module") > -1);
}

app.post('/addModule', urlencodedParser, function(request,response){
    console.log(request.body);
    var data = JSON.parse(Object.keys(request.body)[0]);
    var dummyResponse;
    if(isModule(data)){
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
    var dummyResponse;
    if(isModule(data)){ 
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
    var dummyResponse;
    if(isModule(data)){
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

var server = app.listen(argv["port"], argv["ip"], function(){
    var host = server.address().address;
	var port = server.address().port;

    WoOz_setup();

	console.log("Server listening at http://%s:%s", host, port);  
});