var http = require('http');
var express = require('express');
var app = express();

//options to be used for all tests
var serverRequestOptions = {
	host: 'localhost',
	port: '8081',
	path: '/'
};

//homepage
app.get('/',function(request,response){
	response.sendFile(__dirname + "/" + "tester.html");
});

//initialize testClient for listening for browser requests
var testClient = app.listen(3000,function() {
	var host = testClient.address().address;
	var port = testClient.address().port;

	console.log("Test client listening at http://%s:%s", host, port);
});
