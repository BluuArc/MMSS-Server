var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var sampleModule = JSON.parse('{"isBeingListened":false,"mainServerID":"123.456.789:8080","name":"front door sensor","parameterData":[0],"id":"s0m3m0dul3","type":"sensormodule"}');
var sampleUser = 
	{
		"isBeingListened":false,
		"name":"john doe",
		"id":"s0m3us3r",
		"type":"guardian",
		"logs":["log 1"],
		"notifications":["note 1"]
	};

// Create application/x-www-form-urlencoded parser
// Used in functions related to POST
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//options to be used for all tests
//request reference: http://samwize.com/2013/08/31/simple-http-get-slash-post-request-in-node-dot-js/
var serverRequestOptions = {
	host: 'localhost',
	port: '8081',
	path: '/',
	method: 'GET',
	use_https: false
};

//get a response from the server
function get_server_response(path,method,callbackFn){
	delete serverRequestOptions["headers"];
	delete serverRequestOptions["form"];
	serverRequestOptions.path = path;
	serverRequestOptions.method = method;
	var fullResponse = "";
	var serverRequest;

	//read data
	if(serverRequestOptions.use_https){
		serverRequest = https.get(serverRequestOptions, function(serverResponse){
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
	}else{
		serverRequest = http.get(serverRequestOptions, function(serverResponse){
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
	}

	serverRequest.on('error',function(error){
		console.log(error.stack);
		fullResponse = JSON.stringify(error);
		callbackFn(fullResponse);
	});

	serverRequest.on('end', function(){
		callbackFn(fullResponse);
	});

	serverRequest.end();
};


function send_data_get_response(path, method, dataToSend, callbackFn){
	serverRequestOptions["headers"] = {
		'Content-Type':'application/x-www-form-urlencoded'
	};
	serverRequestOptions["form"] = { 'data': dataToSend};
	serverRequestOptions.path = path;
	serverRequestOptions.method = method;
	var fullResponse = "";
	var my_obj = JSON.parse(dataToSend);

	var url = "http://" + serverRequestOptions.host + ':' + serverRequestOptions.port + path;
	console.log(url);
	if(method.toLowerCase() == 'post'){
		request.post({headers:serverRequestOptions["headers"], url:url, body: dataToSend}, function(err, httpResponse,body){
			if(err){
				callbackFn("Error: " + err);
			}
			console.log(body);
			
			console.log('TODO: Add addition functionality in helper function');
			var response_obj = {
				"success": true,
				"message":"Successfully added " + my_obj["id"]
			};
			callbackFn(JSON.stringify(response_obj));
		});
	}else if (method.toLowerCase() == 'delete'){
		console.log('TODO: Add delete functionality in helper function');
		var response_obj = {
				"success": true,
				"message":"Successfully removed " + my_obj["id"]
		};
		callbackFn(JSON.stringify(response_obj));
	}else{
		var response_obj = {
				"success": false,
				"message":"Error: " + method + " is not a valid request method"
		};
		callbackFn(JSON.stringify(response_obj));
		// callbackFn("Error: " + method + " is not a valid request method");
	}	
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
	serverRequestOptions["use_https"] = request.body.use_https;
	response.redirect('/');
});

app.get('/serverInfo', function(request,response){
	response.end('Every API call will attempt to communicate with ' + 
		serverRequestOptions.host + ":" + serverRequestOptions.port + 
		" using " + ((serverRequestOptions.use_https) ? "HTTPS" : "HTTP"));
});

app.get('/listModules', function(request,response){
	var path = '/listModules';
	get_server_response(path, 'GET', function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/listModules/:type', function(request,response){
	var path = '/listModules/' + request.params.type;
	get_server_response(path, 'GET', function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/addModule', function(request,response){
	var path = '/addModule';
	send_data_get_response(path,'POST',JSON.stringify(sampleModule),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/editModule', function(request,response){
	var path = '/editModule';
	send_data_get_response(path,'POST',JSON.stringify(sampleModule),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/removeModule', function(request,response){
	var path = '/removeModule';
	send_data_get_response(path,'DELETE',JSON.stringify(sampleModule),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/listUsers', function(request,response){
	var path = '/listUsers';
	get_server_response(path, 'GET', function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/listUsers/:type', function(request,response){
	var path = '/listUsers/' + request.params.type;
	get_server_response(path, 'GET', function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/addUser', function(request,response){
	var path = '/addUser';
	send_data_get_response(path,'POST',JSON.stringify(sampleUser),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/editUser', function(request,response){
	var path = '/editUser';
	send_data_get_response(path,'POST',JSON.stringify(sampleUser),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/removeUser', function(request,response){
	var path = '/removeUser';
	send_data_get_response(path,'DELETE',JSON.stringify(sampleUser),function(fullResponse){
		response.end(fullResponse);
	});
});

//initialize testClient for listening for browser requests
var testClient = app.listen(3000,function() {
	var host = testClient.address().address;
	var port = testClient.address().port;

	console.log("Test client listening at http://%s:%s", host, port);
});
