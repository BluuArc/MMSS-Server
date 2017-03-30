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

//get a response from the server (for GET methods)
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

//helper function to handle responses from the server
function handle_request_response(err, httpResponse,body,callbackFn){
	var response_obj = {
		success: false,
		message: ""
	}

	if(err){
		response_obj["message"] = err;
		// var json_err = JSON.parse(err);
		callbackFn(JSON.stringify(response_obj)); //TODO: Fix the return value
	}
	// console.log(body);
	try{
		var json_body = JSON.parse(body);
		callbackFn(JSON.stringify(json_body));//TODO: Fix the return value
	}catch(err){
		response_obj["message"] = err;
		callbackFn(JSON.stringify(response_obj));
	}
}

//handle sending data to the server (for POST and DELETE protocols)
function send_data_get_response(path, method, dataToSend, callbackFn){
	serverRequestOptions["headers"] = {
		'Content-Type':'application/x-www-form-urlencoded'
	};
	serverRequestOptions["form"] = { data: dataToSend};
	serverRequestOptions.path = path;
	serverRequestOptions.method = method;
	var fullResponse = "";
	var my_obj = JSON.parse(dataToSend);
	

	var url = (serverRequestOptions.use_https ? "https://" : "http://") + serverRequestOptions.host + 
		':' + serverRequestOptions.port + path;
	if(method.toLowerCase() == 'post'){
		request.post({headers:serverRequestOptions["headers"], url:url, form: serverRequestOptions["form"]}, function(err, httpResponse,body){
			handle_request_response(err,httpResponse,body,callbackFn);
		});
	}else if (method.toLowerCase() == 'delete'){
		request.delete({headers:serverRequestOptions["headers"], url:url, form: serverRequestOptions["form"]}, function(err, httpResponse,body){
			handle_request_response(err,httpResponse,body,callbackFn);
		});
	}else{
		response_obj["success"] = false;
		response_obj["message"] = "Error: " + method + " is not a valid method";
		callbackFn(JSON.stringify(response_obj));
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

app.get('/module/list', function(request,response){
	var path = '/module/list';
	get_server_response(path, 'GET', function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/module/list/blacklist/:type', function(request,response){
	var path = '/module/list/blacklist/' + request.params.type;
	get_server_response(path, 'GET', function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/module/list/whitelist/:type', function (request, response) {
	var path = '/module/list/whitelist/' + request.params.type;
	get_server_response(path, 'GET', function (fullResponse) {
		response.end(fullResponse);
	});
});

app.get('/module/add', function(request,response){
	var path = '/module/add';
	send_data_get_response(path,'POST',JSON.stringify(sampleModule),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/module/edit', function(request,response){
	var path = '/module/edit';
	var tempModule = JSON.parse(JSON.stringify(sampleModule));
	tempModule["isBeingListened"] = true;
	tempModule["name"] = "the sensor of the front door";
	send_data_get_response(path,'POST',JSON.stringify(tempModule),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/module/remove', function(request,response){
	var path = '/module/remove';
	send_data_get_response(path,'DELETE',JSON.stringify(sampleModule),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/user/list', function(request,response){
	var path = '/user/list';
	get_server_response(path, 'GET', function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/user/list/blacklist/:type', function(request,response){
	var path = '/user/list/blacklist/' + request.params.type;
	get_server_response(path, 'GET', function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/user/list/whitelist/:type', function (request, response) {
	var path = '/user/list/whitelist/' + request.params.type;
	get_server_response(path, 'GET', function (fullResponse) {
		response.end(fullResponse);
	});
});

app.get('/user/add', function(request,response){
	var path = '/user/add';
	send_data_get_response(path,'POST',JSON.stringify(sampleUser),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/user/edit', function(request,response){
	var path = '/user/edit';
	var tempEdit = JSON.parse(JSON.stringify(sampleUser));
	tempEdit["name"] = "A brand new name";
	tempEdit["isBeingListened"] = true;
	tempEdit["type"] = "dependent";
	send_data_get_response(path,'POST',JSON.stringify(tempEdit),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/user/remove', function(request,response){
	var path = '/user/remove';
	send_data_get_response(path,'DELETE',JSON.stringify(sampleUser),function(fullResponse){
		response.end(fullResponse);
	});
});

//convert a date object to the following format
//yyyy-mm-dd hh:mm:ss
function get_formatted_date(date) {
	function get_formatted_num(num, expected_length) {
		var str = "";
		var num_str = num.toString();
		var num_zeros = expected_length - num_str.length;
		for (var i = 0; i < num_zeros; ++i) {
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

app.get('/user/notifications', function(request,response){
	var path = '/user/notifications';

	var data = {
		id: "12345abcde",
		last_update_time: get_formatted_date(new Date('2017-03-01 00:00:00'))
	};
	send_data_get_response(path,'POST',JSON.stringify(data),function(fullResponse){
		response.end(fullResponse);
	});
});

app.get('/module/logs', function (request, response) {
	var path = '/module/logs';

	var data = {
		id: "12345abcde",
		start_time: get_formatted_date(new Date('2017-03-01 00:00:00')),
		end_time: get_formatted_date(new Date())
	};
	send_data_get_response(path, 'POST', JSON.stringify(data), function (fullResponse) {
		response.end(fullResponse);
	});
});

app.get('/module/log',function(request,response){
	var path = '/module/log';
	var data = {
		id: "s0m3m0dul3",
		parameterData: [1],
		time: "2017-03-29 12:00:00",
		message: "Front door sensor was triggered.",
		type: "module"
	};

	send_data_get_response(path, 'POST', JSON.stringify(data), function (fullResponse) {
		response.end(fullResponse);
	});
});

//initialize testClient for listening for browser requests
var testClient = app.listen(3000,function() {
	var host = testClient.address().address;
	var port = testClient.address().port;

	console.log("Test client listening at http://%s:%s", host, port);
});
