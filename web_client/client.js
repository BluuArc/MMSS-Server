var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false, limit: '200mb', parameterLimit: 50000 }));

app.get('/',function(req,res){
    res.end("Hello World!");
})

var testClient = app.listen(4000, function(){
    var host = testClient.address().address;
    var port = testClient.address().port;

    console.log("Test client listening at http://%s:%s", host, port);
});