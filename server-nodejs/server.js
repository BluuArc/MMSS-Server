var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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

var server = app.listen(8081, function(){
    var host = server.address().address;
	var port = server.address().port;

	console.log("Server listening at http://%s:%s", host, port);  
});