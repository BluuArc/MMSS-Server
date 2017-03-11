var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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
    response.end("this is the list modules api call in the server");
});

app.get('/listModules/:type', function(request,response){
    console.log("Received request for listModules");
    response.end("this is the list modules api call for type " + request.params.type + " in the server");
});

app.post('/addModule', urlencodedParser, function(request,response){
    var data = JSON.parse(request.body.data);
    var type = request.body.type.toLowerCase();
    if(type.equals("user")){
        addUser(data);
    }else if(type.equals("module")){
        addModule(data);
    }else{
        console.log("addModule: Invalid data type received");
        console.log(data);
    }
    response.end();
})

var server = app.listen(80, function(){
    var host = server.address().address;
	var port = server.address().port;

	console.log("Server listening at http://%s:%s", host, port);  
});