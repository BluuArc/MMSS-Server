var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
// Used in functions related to POST
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//options to be used for all tests
var serverRequestOptions = {
	host: 'localhost',
	port: '8081',
	path: '/',
	method: 'GET'
};

//get a response from the server
function get_server_response(path,method,callbackFn){
	serverRequestOptions.path = path;
	serverRequestOptions.method = method;
	var fullResponse = "";

	//read data
	var serverRequest = https.get(serverRequestOptions, function(serverResponse){
		serverResponse.on('data', function(data) {
			fullResponse += data;
		});

		// finished reading all data
		serverResponse.on('end', function(){
			callbackFn(fullResponse);
		});

		serverResponse.on('error', function(error){
			callbackFn(JSON.stringify(error));
		});
	});

	serverRequest.on('error',function(error){
		console.log(error.stack);
		fullResponse = JSON.stringify(error);
		callbackFn(fullResponse);
	});

	serverRequest.on('end', function(){
		callbackFn(fullResponse);
	});

	serverRequest.end();
}

//homepage
app.get('/',function(request,response){
	response.sendFile(__dirname + "/" + "tester.html");
});

//let test client set address and port of server being tested
app.post('/setServerOptions', urlencodedParser,function(request,response){
	if(request.body.ip_address != "")
		serverRequestOptions.host = request.body.ip_address;
	if(request.body.ip_port != "")
		serverRequestOptions["port"] = request.body.ip_port;
	else
		delete serverRequestOptions["port"];
	response.redirect('/');
});

app.get('/serverInfo', function(request,response){
	response.end('Every API call will attempt to communicate with ' + 
		serverRequestOptions.host + ":" + serverRequestOptions.port);
});

app.get('/listModules', function(request,response){
	var path = '/listModules';
	get_server_response(path, 'GET', function(fullResponse){
		response.end('This is a dummy response for ' + path +'.\nThe response is\n---\n' + fullResponse);
	});
});

app.get('/listModules/:type', function(request,response){
	var path = '/listModules/' + request.params.type;
	get_server_response(path, 'GET', function(fullResponse){
		response.end('This is a dummy response for ' + path + '.\nThe response is\n---\n' + fullResponse);
	});
});

app.get('/listUsers', function(request,response){
	var path = '/listUsers';
	get_server_response(path, 'GET', function(fullResponse){
		response.end('This is a dummy response for ' + path +'.\nThe response is\n---\n' + fullResponse);
	});
});

app.get('/listUsers/:type', function(request,response){
	var path = '/listUsers/' + request.params.type;
	get_server_response(path, 'GET', function(fullResponse){
		response.end('This is a dummy response for ' + path + '.\nThe response is\n---\n' + fullResponse);
	});
});


//initialize testClient for listening for browser requests
var testClient = app.listen(3000,function() {
	var host = testClient.address().address;
	var port = testClient.address().port;

	console.log("Test client listening at http://%s:%s", host, port);
});
