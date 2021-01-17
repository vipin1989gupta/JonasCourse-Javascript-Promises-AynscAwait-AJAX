const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
var router = express.Router();
//var network = require('./fabric/network.js');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())

var cfenv = require('cfenv');

var fs = require("fs");



var appRouter = require('./records')
app.use('/records', appRouter);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var swaggerDocumentOptions = {
  explorer : true
};

app.use('/api/docs', swaggerUi.serve);
app.get('/api/docs', swaggerUi.setup(swaggerDocument, swaggerDocumentOptions));
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
app.use(function(req, res, next) {
  next(createError(404));
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
  console.log("Swagger Documentation running on " + appEnv.url+"/api/docs");
});


module.exports = app;