

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, function() {
    console.log("Listening on port 3000");
});