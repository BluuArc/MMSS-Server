var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
// Used in functions alreated to POST
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//options to be used for all tests
var serverRequestOptions = {
	host: 'localhost',
	port: '8081',
	path: '/',
	method: 'GET'
};

//callback function for http.request calls
function get_http_response(response){
	//continuously update stream with data
	var body = '';
	response.on('data', function(data) {
		body += data;
	});

	// finished reading all data
	response.on('end', function(){
		return body;
	});

	response.on('error', function(error){
		return JSON.stringify(error);
	});
};

//get a response form the server
function get_server_response(path,method,callbackFn){
	serverRequestOptions.path = path;
	serverRequestOptions.method = method;
	var fullResponse = "";
	var serverRequest = http.get(serverRequestOptions, function(serverResponse){
			fullResponse = get_http_response(serverResponse);
	});
	serverRequest.on('error',function(error){
		console.log(error.stack);
		fullResponse = JSON.stringify(error);//"Error code: " + error.code + "<br>Error number: " + error.errno;
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

//let test client set location of server being tested
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
	response.send('Every API call will attempt to communicate with ' + 
		serverRequestOptions.host + ":" + serverRequestOptions.port);
});

app.get('/listModules', function(request,response){
	get_server_response('/listModules', 'GET', function(fullResponse){
		response.send('This is a dummy response for /listModules.\
		The response is<br>' + fullResponse);
	});
});

app.get('/listModules/:type', function(request,response){
	response.send('This is a dummy response for /listModules/' + request.params.type);
});

app.get('/listUsers', function(request,response){
	response.send('This is a dummy response for /listUsers');
});

app.get('/listUsers/:type', function(request,response){
	response.send('This is a dummy response for /listUsers/' + request.params.type);
});


//initialize testClient for listening for browser requests
var testClient = app.listen(3000,function() {
	var host = testClient.address().address;
	var port = testClient.address().port;

	console.log("Test client listening at http://%s:%s", host, port);
});
