var fs = require('fs');
var underscore = require('underscore'); 
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var argv = require('yargs')
    .usage('Usage: $0 -p [integer] -i [string of IP address] [--debug] [--demo]')
    .default("p", 80)
    .default("i", '127.0.0.1')
    .default("d", false)
    .default("w", false)
    .alias('p', 'port')
    .alias('i', 'ip').alias('i','ip-address')
    .alias('w',"demo") //originally Wizard of Oz function
    .alias('d', 'debug')
    .describe('p', 'Port to run server on')
    .describe('i', 'IP Address to run server on')
    .describe('w', 'Demo/Wizard of Oz mode; prepopulate the lists with demo data')
    .describe('d', 'Debug mode; allows manual saving of data.')
    .help('h')
    .alias('h', 'help')
    .argv;

var users = [];
var modules = [];
var notifications = [];
var logs = [];

//live chat functionaliy initially based off of Socket IO tutorial
//https://socket.io/get-started/chat/
io.on('connection', function (socket) {
    console.log('A user connected');    

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

//broadcast a message to users
function broadcast(msg, formattingFunction){
    if(argv["debug"]){
        var result = msg;
        if (formattingFunction != undefined)
            result = formattingFunction(msg);
        io.emit('chat message', result);
    }
}

// Create application/x-www-form-urlencoded parser
// Used in functions related to POST
var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '200mb', parameterLimit: 50000 });
app.use(urlencodedParser);
app.use(bodyParser.json({ limit: '200mb' }));
app.use(express.static('frontend'));

var server_info = null;
function get_this_server_info() {
    if(server_info == null){
        var host = server.address().address.toString();
        var port = server.address().port.toString();
        server_info = {
            id: host + ":" + port,
            type: "server"
        }
    }
    return server_info;
}

// sample setup
function demo_setup(){
    console.log("**NOTE:** STARTING DEMO MODE");
    user1 = {
        editor_info: {
            id: "4dminu53r",
            type: "user"
        },
        name: "billy bob",
        id: "67890fghij",
        type: "dependent",
        logs: [],
        notifications: [],
        isBeingListened: false,
        last_update_time: "2017-03-20 12:34:56"
    };
    user2 = {
        editor_info: {
            id: "l33tgu4rd1an",
            type: "user"
        },
        name: "john doe",
        id: "12345abcde",
        type: "guardian",
        logs: [],
        notifications: [],
        isBeingListened: true,
        last_update_time: get_formatted_date(new Date())
    };
    
    addUser(user2);
    addUser(user1);
    var tempUser = JSON.parse(JSON.stringify(user2));
    tempUser["isBeingListened"] = true;
    editUser(tempUser["id"], tempUser);
    // users[1]["isBeingListened"] = true;

    module1 =  {
        editor_info: {
            id: "4dminu53r",
            type: "user"
        },
        name: "front door sensor",
        type: "sensormodule",
        id: "12345abcde",
        mainServerID: "123.456.789:8080",
        parameterData: [
            0
        ],
        isBeingListened: false,
    }
    module2 = {
        editor_info: {
            id: "l33tgu4rd1an",
            type: "user"
        },
        mainServerID: "123.456.789:8080",
        name: "front door lights",
        parameterData: [
            1
        ],
        id: "67890fghij",
        type: "interactivemodule",
        isBeingListened: true,
    }
    addModule(module1);
    addModule(module2);
    var tempModule = JSON.parse(JSON.stringify(module2));
    tempModule["isBeingListened"] = true;
    editModule(tempModule["id"],tempModule);
    // modules[1]["isBeingListened"] = true;

    //update modules for current server ID
    //this will be done manually on client side
    underscore.forEach(modules, function(single_module){
        single_module["mainServerID"] = get_this_server_info()["id"];
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

function create_log_entry(author_info,subject_type,msg,objects){
    var logEntry = {
        author_info:{
            id: author_info["id"],
            type: author_info["type"]
        },
        message: msg,
        time: get_formatted_date(new Date()),
        subject_type: subject_type,
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
    broadcast(notification, function(notification){
        return "[" + notification["time"] + "] " + (notification["success"] ? "SUCCESS" : "FAIL") +" NOTIF: " + 
            notification["message"];
    });
}

function log_new_entry(source_info,subject_type,msg,objects){
    var logEntry = create_log_entry(source_info,subject_type,msg,objects);
    logs.push(logEntry);
    broadcast(logEntry,function(logEntry){
        return "[" + logEntry["time"] + "] LOG: " + logEntry["message"];
    });
}

app.get('/', function (request, response) {
    if (argv["debug"])
        response.sendFile(__dirname + "/index.html"); //debug viewer
    else
        response.end("Welcome to the homepage.");
});

app.get('/save', function(request,response){
    var msg = {
        success: false,
        message: ""
    };
    if(argv["debug"]){
        save_data("debug_users.json",JSON.stringify(users),function(){
            log_new_entry(get_this_server_info(), "server","Saved debug_user.json",[]);
            console.log("Saved debug_user.json");
        });
        save_data("debug_modules.json", JSON.stringify(modules), function(){
            log_new_entry(get_this_server_info(), "server", "Saved debug_modules.json", []);
            console.log("Saved debug_modules.json");
        });
        save_data("debug_logs.json", JSON.stringify(logs), function(){
            log_new_entry(get_this_server_info(), "server", "Saved debug_logs.json", []);
            console.log("Saved debug_logs.json");
        });
        save_data("debug_notifications.json", JSON.stringify(notifications), function(){
            log_new_entry(get_this_server_info(), "server", "Saved debug_notifications.json", []);
            console.log("Saved debug_notifications.json");
        });
        msg.success = true;
        msg.message = "Saving data. Please refer to server console output for more info.";
    }else{
        msg.message = "Debug mode not enabled. Please enable debug mode to use this function.";
    }
    response.end(JSON.stringify(msg));
});

//find user by ID
//TODO: Add permission checking?
app.get('/user/id/:id', function(request,response){
    var user = findIn(users,'id',request.params.id);
    if(user != null){
        response.send(JSON.stringify(user.info));
    }else{
        var emptyUser = {
            name: "not found",
            id: "not found",
            type: "not found",
            logs: [],
            notifications: [],
            isBeingListened: false,
            last_update_time: "1970-01-01 00:00:00"
        }
        response.send(JSON.stringify(emptyUser));
    }
})

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
    isValid = isValid && json_obj.id != undefined && json_obj.id.length > 0;
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
    var search = findIn(users,'id', user_obj["id"]);
    if(search == null){
        var isBeingListened = false;
        user_obj["isBeingListened"] = false; //add to blacklist
        users.push(user_obj);
        if (users.length == 1) {//if new user is the first user, automatically elevate their permissions
            users[0]["isBeingListened"] = true;
            users[0]["type"] = "guardian";
            isBeingListened = true;
        }

        var msg = "Added " + user_obj["name"] + " to the " + (isBeingListened ? " whitelist." : " blacklist.");
        notify(true, msg, [user_obj]);
        log_new_entry(get_this_server_info(),"user",msg,[user_obj]);
        return true;
    }else{//user already exists
        var msg = "Attempted to add user " + user_obj["name"] + " to the server, but " + user_obj["id"] + " already exists.";
        log_new_entry(get_this_server_info(),"user", msg,[]);
        return false;
    }
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
            if(users.length > 1){
                result.message = "Added " + data["name"] + " to the blacklist.";
            }else{
                result.message = "Added " + data["name"] + " to the whitelist.";
            }
        }else{
            result.message = "User with ID " + data["id"] + " already exists the server.";
        }
    }else{
        console.log("user/add: Invalid data type received");
        console.log(data);
        result.message = "Input type is not a user";
    }
    response.end(JSON.stringify(result));
});

function hasPermission(editor_info){
    // console.log(editor_info);
    //ensure all fields exist
    if (editor_info == undefined || editor_info["id"] == undefined || editor_info["type"] == undefined) {
        return false;
    }
    // console.log("Finding editor");
    var editor = null;
    //check if editor exists on the server
    if(editor_info["type"] == "user"){
        editor = findIn(users,'id',editor_info["id"]);
    }else if(editor_info["type"] == "module"){
        editor = findIn(modules, 'id', editor_info["id"]);
    }
    if(editor == null){
        return false;
    }

    //check if editor isn't blacklisted
    return editor.info["isBeingListened"];
}

function removeUser(id, editor_info) {
    var user = findIn(users, 'id', id);
    
    //user found, so delete it
    if (user != null) {
        var name = user.info["name"];
        users.splice(user["index"], 1);
        var msg = "Deleted " + name + " from the server.";
        notify(true,msg, [user.info]);
        log_new_entry(editor_info,"user",msg,[user.info]);
        return true;
    } else {
        var msg = "Can't delete user ID " + id + " from the server because it wasn't found";
        log_new_entry(editor_info,"user",msg,[{type:"user",id:id}]);
        return false;
    }
}

app.delete('/user/remove', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    // console.log(data);
    var result = {
        success: false,
        message: ""
    };
    if(hasPermission(data["editor_info"])){
        result.success = removeUser(data["id"], data["editor_info"]);

        if (result.success) {
            result.message = "Removed User ID " + data["id"] + " from the server.";
        } else {
            result.message = "User ID " + data["id"] + " not found on the server.";
        }
    }else{
        result.message = "Editor info is invalid or doesn't have correct permissions.";
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
        response.message = "User ID " + id + " not found on the server.";
        log_new_entry(newData["editor_info"], "user", response.message, [newData]);
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
    log_new_entry(newData["editor_info"], "user", response.message, [newData]);
    users[searchResult.index] = user;
    return response;
}

app.post('/user/edit', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var operationResult = {};
    if (hasPermission(data["editor_info"])) {
        try {
            operationResult = editUser(data["id"], data);
        } catch (err) { 
            console.log(err);
            operationResult =  {
                success: false,
                message: "Something went wrong with the editing user operation."
            };
        }
    }else{
        operationResult = {
            success: false,
            message: "Editor info is invalid or doesn't have correct permissions."
        }
    }
    response.end(JSON.stringify(operationResult));
});


//find module by ID
//TODO: Add permission checking?
app.get('/module/id/:id', function (request, response) {
    var myModule = findIn(modules, 'id', request.params.id);
    if (myModule != null) {
        response.send(JSON.stringify(myModule.info));
    } else {
        var emptyModule = {
            name: "not found",
            id: "not found",
            type: "not found",
            mainServerID: "not found",
            parameterData: ["not found"],
            isBeingListened: false,
            last_update_time: "1970-01-01 00:00:00"
        }
        response.send(JSON.stringify(emptyModule));
    }
})

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
    var filteredList = underscore.filter(modules, function (curModule) {
        return (curModule["isBeingListened"] == true) && (curModule.type.toLowerCase() == request.params.type.toLowerCase());
    });
    response.end(JSON.stringify(filteredList));
});

app.get('/module/list/blacklist/:type', function (request, response) {
    var filteredList = underscore.filter(modules, function (curModule) {
        return (curModule["isBeingListened"] == false) && (curModule.type.toLowerCase() == request.params.type.toLowerCase());
    });
    response.end(JSON.stringify(filteredList));
});

//TODO: get better way of searching
function isModule(json_obj){
    return (json_obj.type != undefined &&
        json_obj.type.toLowerCase().search("module") > -1);
}

//todo: delete editor_info field?
function addModule(module_obj){
    var search = findIn(modules, 'id', module_obj["id"]);
    if (search == null) {
        module_obj["isBeingListened"] = false;
        modules.push(module_obj);
        var msg = "Added " + module_obj["name"] + " to the blacklist.";
        notify(true, msg, [module_obj]);
        log_new_entry(get_this_server_info(), "module", msg, [module_obj]);
        return true;
    }else{
        var msg = "Attempted to add module " + module_obj["name"] + " to the server, but " + module_obj["id"] + " already exists.";
        log_new_entry(get_this_server_info(), "module", msg, [module_obj]);
        return false;
    }
}

app.post('/module/add', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var result = {
        success: false,
        message: ""
    };
    if(isModule(data)){
        result.success = addModule(data);
        if (result.success) {
            result.message = "Added " + data["name"] + " to the blacklist.";
        } else {
            result.message = "Module with ID " + data["id"] + " already exists on the server.";
        }
    }else{
        console.log("module/add: Invalid data type received");
        console.log(data);
        result.message = "Input type is not a module";
    }
    response.end(JSON.stringify(result));
});

function removeModule(id, editor_info){
    var desired_module = findIn(modules, 'id',id);
    if(desired_module != null){
        var name = desired_module.info["name"];
        modules.splice(desired_module["index"], 1);
        var msg = "Deleted " + name + " from the server.";
        notify(true, msg, [desired_module.info]);
        log_new_entry(editor_info, "module", msg, [desired_module.info]);
        return true;
    }else{
        var msg = "Can't delete module ID " + id + " from the server because it wasn't found";
        log_new_entry(editor_info, "module", msg, [{type:"module",id:id}]);
        return false;
    }

}

app.delete('/module/remove', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var result = {
        success: false,
        message: ""
    };

    if (hasPermission(data["editor_info"])) {
        result.success = removeModule(data["id"], data["editor_info"]);

        if(result.success){
            result.message = "Removed Module with ID " + data["id"] + " from the server.";
        }else{
            result.message = "Module ID " + data["id"] + " not found on the server.";
        }
    }else{
        result.message = "Editor info is invalid or doesn't have correct permissions.";
    }
    response.end(JSON.stringify(result));
});

function editModule(id, newData){
    var changeLog = [];
    var editableFields = ["name", "isBeingListened"]; //fields that are possible to change
    var oldData = {};
    var response = {
        success: false,
        message: ""
    };

    var searchResult = findIn(modules,'id',id);
    if(searchResult == null){
        response.message = "Module ID " + id + " not found on the server.";
        log_new_entry(newData["editor_info"], "module", response.message, [newData]);
        return response;
    }   

    var found_module = searchResult.info;

    //change data
    for (f in newData) {
        if (editableFields.indexOf(f) > -1 && found_module[f] != null &&
            found_module[f].toString().length > 0 && found_module[f] != newData[f]) {
            oldData[f] = found_module[f];
            found_module[f] = newData[f];
            if (f == "name") {
                changeLog.push("Changed name of " + found_module["id"] + " to be '" + found_module["name"] + "'. ");
            } else if (f == "isBeingListened") {
                changeLog.push("Module " + found_module["id"] + " is now on the " + ((found_module[f] == true) ? "whitelist. " : "blacklist. "));
            }
        }
    }

    if (changeLog.length > 0 && isModule(found_module)) {
        response.success = true;
        //convert changeLog to string
        response.message = underscore.reduce(changeLog, function (acc, s) { return acc + s }, "");
        notify(true, response.message, [found_module]);
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
    log_new_entry(newData["editor_info"], "module", response.message, [newData]);
    modules[searchResult.index] = found_module;
    return response;    
}

app.post('/module/edit', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var operationResult = {};
    if (hasPermission(data["editor_info"])) {
        try{
            operationResult = editModule(data["id"],data);
        }catch(err){
            console.log(err);
            operationResult = {
                success: false,
                message: "Something went wrong with the editing module operation."
            };
        }
    }else{
        operationResult = {
            success: false,
            message: "Editor info is invalid or doesn't have correct permissions."
        }
    }
    response.end(JSON.stringify(operationResult));
});

//check if log object has all of the expected fields, no more, no less
function isValidLog(log_obj){
    var expectedFields = ["data", "message", "time", "subject_type", "author_info"];
    for(f in expectedFields){
        if(log_obj[expectedFields[f]] != undefined){
            // console.log(f + ": " + log_obj[expectedFields[f]])
            if (expectedFields[f] != "data" && log_obj[expectedFields[f]].length == 0){
                return false;
            }
        }else{
            return false;
        }
    }

    for(f in log_obj){
        if(expectedFields.indexOf(f) == -1){
            return false;
        }
    }
    return true;
}

app.post('/module/log', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    // console.log(data);
    var result = {
        success: false,
        message: ""
    }
    //todo: check to see if module is on blacklist before accepting
    result.success = isValidLog(data);
    if(result.success){
        logs.push(data);
        notify(true,data["message"],data["data"]);
        // console.log(logs);
        result.message = "Successfully logged message."
    }else{
        result.message = "Log data isn't valid."
    }
    response.end(JSON.stringify(result));
});

function get_logs(startDate,endDate){
    var start = new Date(startDate);
    var end = new Date(endDate);
    var filteredList = underscore.filter(logs, function (log) {
        var curDate = new Date(log["time"]);
        return (curDate >= start && curDate <= end);
    });
    return filteredList;
}

app.post('/logs', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    try {
        //only allow users already in the server to query log data
        var user = findIn(users, 'id', data["id"]);
        if (user.index > -1) {
            // console.log(logs);
            var filtered_logs = get_logs(data["start_time"], data["end_time"]);
            // console.log(filtered_logs);
            response.end(JSON.stringify(filtered_logs));
        }else{
            throw "User with ID " + data["id"] + " is not found on the server.";
        }
    } catch (err) {
        console.log(err);
        response.end(JSON.stringify([]));
    }
});

function get_notifications(startDate, endDate){
    var start = new Date(startDate);
    var end = new Date(endDate);
    var filteredList = underscore.filter(notifications,function(single_notif){
        var curDate = new Date(single_notif["time"]);
        return (curDate >= start && curDate <= end);
    })
    return filteredList;
}

app.post('/notifications', urlencodedParser,function(request, response){
    var data = JSON.parse(request.body.data);
    try{
        //only allow users already in the server to query notifications
        var user = findIn(users, 'id', data["id"]);
        if(user.index > -1){
            var filtered_notifications = get_notifications(data["last_update_time"], new Date());
            response.end(JSON.stringify(filtered_notifications));
        }
    }catch(err){
        console.log(err);
        response.end(JSON.stringify([]));
    }
});

server.listen(argv["port"], argv["ip"], function(){
    if(argv["debug"])
        console.log("Debug mode is on.");

    if(argv["demo"])
        demo_setup();

    console.log("Server listening at http://%s", get_this_server_info()["id"]);  
});
