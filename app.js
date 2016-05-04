var path = require('path');
var Server = require(path.join(__dirname, 'server', 'server.js'));
var config = require('./config/config')(__dirname);
var server = new Server(config);
var dateUtils = require('./libs/date');
server.start();

server.initGlobalVariables();

server.connectDb();