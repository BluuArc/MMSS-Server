var fs = require('fs');
var underscore = require('underscore'); 
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
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
var notifications = [];
var logs = [];


// Create application/x-www-form-urlencoded parser
// Used in functions related to POST
var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '200mb', parameterLimit: 50000 });
app.use(urlencodedParser);
app.use(bodyParser.json({ limit: '200mb' }));


function get_this_server_id() {
    var host = server.address().address.toString();
    var port = server.address().port.toString();
    return host + ":" + port;
}

// sample setup
function demo_setup(){
    console.log("**NOTE:** STARTING WIZARD OF OZ DEMO");
    user1 = {
        "isBeingListened": false,
        "name": "billy bob",
        "id": "67890fghij",
        "type": "dependent",
        "logs": [
            "log 1"
        ],
        "notifications": [
            "note 1"
        ]
    };
    user2 = {
        "isBeingListened": true,
        "name": "john doe",
        "id": "12345abcde",
        "type": "guardian",
        "logs": [
            "log 1"
        ],
        "notifications": [
            "note 1"
        ]
    };
    
    addUser(user1);
    addUser(user2);
    users[1]["isBeingListened"] = true;

    modules = [
        {
            "isBeingListened": false,
            "mainServerID": "123.456.789:8080",
            "name": "front door sensor",
            "parameterData": [
                0
            ],
            "id": "12345abcde",
            "type": "sensormodule"
        },
        {
            "isBeingListened": true,
            "mainServerID": "123.456.789:8080",
            "name": "front door lights",
            "parameterData": [
                1
            ],
            "id": "67890fghij",
            "type": "interactivemodule"
        }
    ];
    //update modules for current server ID
    underscore.forEach(modules, function(single_module){
        single_module["mainServerID"] = get_this_server_id();
    })
}

//wrapper for asynchronous/synchronous file save
function save_data(filename, object_data, callbackFn){
    if(typeof callbackFn != "function")
        fs.writeFileSync(filename, object_data);
    else{
        fs.writeFile(filename, object_data, callbackFn);
    }
}

//wrapper for asynchronous/synchronous file load
function load_data(filename, callbackFn){
    if(typeof callbackFn != "function"){
        try{
            var data = fs.readFileSync(filename, 'utf8');
            return data;
        }catch(err){
            console.error(err);
            throw err.stack;
        }
    }else{
        try {
            var data = fs.readFile(filename, 'utf8', callbackFn);
        } catch (err) {
            console.error(err);
            throw err.stack;
        }
    }
}

//convert a date object to the following format
//yyyy-mm-dd hh:mm:ss
function get_formatted_date(date){
    function get_formatted_num(num, expected_length){
        var str = "";
        var num_str = num.toString();
        var num_zeros = expected_length - num_str.length;
        for(var i = 0; i < num_zeros; ++i){
            str += '0';
        }
        str += num_str;
        return str;
    }
    var msg = get_formatted_num(date.getFullYear(), 4) + "-";
    msg += get_formatted_num(date.getMonth() + 1, 2) + "-";
    msg += get_formatted_num(date.getDate(), 2) + " ";
    msg += get_formatted_num(date.getHours(), 2) + ":";
    msg += get_formatted_num(date.getMinutes(), 2) + ":";
    msg += get_formatted_num(date.getSeconds(), 2);
    return msg;
}

function create_notification(success,msg,objects){
    var notification = {
        success: success,
        message: msg,
        time: get_formatted_date(new Date()),
        data: []
    };

    //add data objects, if any
    var len = objects.length;
    for (var i = 0; i < len; ++i) {
        var tempObject = {
            type: (isValidUser(objects[i])) ? "user" : ((isModule(objects[i])) ? "module" : "none"),
            id: objects[i]["id"]
        }
        notification.data.push(tempObject);
    }
    return notification;
}

function create_log_entry(source_id,success,msg,objects){
    var logEntry = {
        source_id: source_id,
        success: msg,
        time: get_formatted_date(new Date()),
        data: []
    }

    //add data objects, if any
    var len = objects.length;
    for (var i = 0; i < len; ++i) {
        var tempObject = {
            type: (isValidUser(objects[i])) ? "user" : ((isModule(objects[i])) ? "module" : "none"),
            id: objects[i]["id"]
        }
        logEntry.data.push(tempObject);
    }
    return logEntry;
}

function notify(success,msg,objects){
    var notification = create_notification(success,msg,objects);
    notifications.push(notification);
}

function log_new_entry(source_id,success,msg,objects){
    var logEntry = create_log_entry(source_id,success,msg,objects);
    logs.push(logEntry);
}

function notify_and_log(source_id,success,msg,objects){
    notify(success,msg,objects);
    log_new_entry(source_id,msg,objects);
}

app.get('/', function (request, response) {
    response.end("Welcome to the homepage.");
});

app.get('/user/list', function (request, response) {
    response.end(JSON.stringify(users));
});

app.get('/user/list/blacklist', function (request, response) {
    var filteredList = underscore.filter(users, function (user) {
        return user["isBeingListened"] == false;
    })
    response.end(JSON.stringify(filteredList));
});

app.get('/user/list/blacklist/:type', function (request, response) {
    var filteredList = underscore.filter(users, function (user) {
        return (user["isBeingListened"] == false) && (user.type.toLowerCase() == request.params.type.toLowerCase());
    });

    response.end(JSON.stringify(filteredList));
});

app.get('/user/list/whitelist', function (request, response) {
    var filteredList = underscore.filter(users, function (user) {
        return user["isBeingListened"] == true;
    })
    response.end(JSON.stringify(filteredList));
});

app.get('/user/list/whitelist/:type', function (request, response) {
    var filteredList = underscore.filter(users, function (user) {
        return (user["isBeingListened"] == true) && (user.type.toLowerCase() == request.params.type.toLowerCase());
    });
    response.end(JSON.stringify(filteredList));
    // response.end("this is the list users api call for type " + request.params.type + " in the server");
});

//TODO: get better way of searching
function isValidUser(json_obj) {
    var isValid = (json_obj["logs"] != undefined && json_obj["notifications"] != undefined);
    if(json_obj["type"] != undefined){
        var validTypes = ["guardian", "dependent"]
        isValid  = isValid && (validTypes.indexOf(json_obj.type.toLowerCase() > -1));
    }
    if(json_obj["name"] != undefined){
        isValid = isValid &&json_obj.name.length > 0;
    }
    return isValid;
}

function findIn(array, fieldName, fieldData){
    for(e in array){
        var curElem = array[e];
        if(curElem[fieldName] == fieldData){
            return {
                info: curElem,
                index: e
            };
        }
    }
    return null;
}

function addUser(user_obj) {
    user_obj["isBeingListened"] = false; //add to blacklist
    users.push(user_obj);
    notify(true, "Added " + user_obj["name"] + " to the blacklist.", [user_obj]);
    return true;
}

app.post('/user/add', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var result = {
        success: false,
        message: ""   
    };
    if(isValidUser(data)){
        result.success = addUser(data);
        
        if(result.success){
            result.message = "Added " + data["name"] + " to the blacklist.";
        }else{//shouldn't happen
            result.message = "Error adding " + data["name"] + " to the server.";
        }
    }else{
        console.log("user/add: Invalid data type received");
        console.log(data);
        result.message = "Input type is not a user";
    }
    response.end(JSON.stringify(result));
});

function removeUser(id) {
    var user = findIn(users, 'id', id);
    //user found, so delete it
    if (user != null) {
        var name = user.info["name"];
        users.splice(user["index"], 1);
        notify(true, "Deleted " + name + " from the server.", [user.info]);
        return true;
    } else {
        return false;
    }
}

app.delete('/user/remove', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var result = {
        success: false,
        message: ""
    };
    result.success = removeUser(data["id"]);

    if (result.success) {
        result.message = "Removed User ID " + data["id"] + " from the server.";
    } else {
        result.message = "User ID " + data["id"] + " doesn't exist on the server.";
    }
    response.end(JSON.stringify(result));
});

function editUser(id, newData) {
    var changeLog = [];
    var editableFields = ["name", "type", "isBeingListened"]; //fields that are possible to change
    var oldData = {};
    var response = {
        success: false,
        message: ""
    };

    var searchResult = findIn(users, 'id', id);
    if (searchResult == null) {
        response.message = "User not found";
        return response;
    }
    var user = searchResult.info;

    //change data
    for (f in newData) {
        if (editableFields.indexOf(f) > -1 && user[f] != null &&
            user[f].toString().length > 0 && user[f] != newData[f]) {
            oldData[f] = user[f];
            user[f] = newData[f];
            if (f == "name") {
                changeLog.push("Changed name of " + user["id"] + " to be '" + user["name"] + "'. ");
            } else if (f == "type") {
                changeLog.push("Changed the type of " + user["id"] + " to be " + user[f] + ". ");
            } else if (f == "isBeingListened") {
                changeLog.push("User " + user["id"] + " is now on the " + ((user[f] == true) ? "whitelist. " : "blacklist. "));
            }
        }
    }

    if (changeLog.length > 0 && isValidUser(user)) {
        response.success = true;
        //convert changeLog to string
        response.message = underscore.reduce(changeLog, function (acc, s) { return acc + s }, "");
        notify(true, response.message, [user]);
    } else {
        if (changeLog.length == 0) {
            response.message = "No changed values were detected.";
        } else {
            //put back oldData
            for (f in oldData) {
                user[f] = oldData[f];
            }
            response.message = "One or more values were invalid.";
        }
    }
    users[searchResult.index] = user;
    return response;
}

app.post('/user/edit', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var operationResult = {};
    try {
        operationResult = editUser(data["id"], data);
    } catch (err) { 
        console.log(err);
        operationResult =  {
            success: false,
            message: "Something went wrong with the editing user operation."
        };
    }
    response.end(JSON.stringify(operationResult));
});



app.get('/module/list', function(request,response){
    response.end(JSON.stringify(modules));
});


app.get('/module/list/whitelist/', function(request,response){
    var filteredList = underscore.filter(modules, function (curModule) {
        return (curModule["isBeingListened"] == true);
    });
    response.end(JSON.stringify(filteredList));
});

app.get('/module/list/blacklist/', function (request, response) {
    var filteredList = underscore.filter(modules, function (curModule) {
        return (curModule["isBeingListened"] == false);
    });
    response.end(JSON.stringify(filteredList));
});

app.get('/module/list/whitelist/:type', function (request, response) {
    // console.log("TODO: add type search functionality for module/list");
    var filteredList = underscore.filter(modules, function (curModule) {
        return (curModule["isBeingListened"] == true) && (curModule.type.toLowerCase() == request.params.type.toLowerCase());
    });
    response.end(JSON.stringify(filteredList));
    // response.end("this is the list modules api call for type " + request.params.type + " in the server");
});

app.get('/module/list/blacklist/:type', function (request, response) {
    // console.log("TODO: add type search functionality for module/list");
    var filteredList = underscore.filter(modules, function (curModule) {
        return (curModule["isBeingListened"] == false) && (curModule.type.toLowerCase() == request.params.type.toLowerCase());
    });
    response.end(JSON.stringify(filteredList));
    // response.end("this is the list modules api call for type " + request.params.type + " in the server");
});

//TODO: get better way of searching
function isModule(json_obj){
    return (json_obj.type != undefined &&
        json_obj.type.toLowerCase().search("module") > -1);
}

app.post('/module/add', urlencodedParser, function(request,response){
    // console.log(request.body);
    var data = JSON.parse(request.body.data);
    var dummyResponse;
    if(isModule(data)){
        console.log("TODO: add module/add functionality");
        dummyResponse = {
            success: true,
            message: "Added " + data.id + " to the module list."
        };
    }else{
        console.log("module/add: Invalid data type received");
        console.log(data);
        dummyResponse = {
            success: false,
            message: "Input type is not a module"
        };
    }
    response.end(JSON.stringify(dummyResponse));
});

app.delete('/module/remove', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var dummyResponse;
    if(isModule(data)){ 
        console.log("TODO: add module/remove functionality");
        dummyResponse = {
            success: true,
            message: "Removed " + data.id + " from the module list."
        };
    }else{
        console.log("module/remove: Invalid data type received");
        console.log(data);
        dummyResponse = {
            success: false,
            message: "Input type is not a module"
        };
    }
    response.end(JSON.stringify(dummyResponse));
});

app.post('/module/edit', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var dummyResponse;
    if(isModule(data)){
        console.log("TODO: add module/edit functionality");
        dummyResponse = {
            success: true,
            message: "Changed " + data.id + " values."
        };
    }else{
        console.log("module/edit: Invalid data type received");
        console.log(data);
        dummyResponse = {
            success: false,
            message: "Input type is not a module"
        };
    }
    response.end(JSON.stringify(dummyResponse));
});

function get_notifications_after(date_string){
    var date = new Date(date_string);
    // console.log(notifications);
    // console.log("Date is " + date.toString());
    var filteredList = underscore.filter(notifications,function(single_notif){
        return (new Date(single_notif["time"])) >= date;
    })
    return filteredList;
}

app.post('/user/notifications', urlencodedParser,function(request, response){
    var data = JSON.parse(request.body.data);
    // console.log(data);
    try{
        //only allow users already in the server to query notifications
        var user = findIn(users, 'id', data["id"]);
        if(user.index > -1){
            var filtered_notifications = get_notifications_after(data["last_update_time"]);
            response.end(JSON.stringify(filtered_notifications));
        }
    }catch(err){
        console.log(err);
        response.end(JSON.stringify([]));
    }
    
})

var server = app.listen(argv["port"], argv["ip"], function(){
    demo_setup();

    console.log("Server listening at http://%s", get_this_server_id());  
});