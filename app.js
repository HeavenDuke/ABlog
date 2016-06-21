var path = require('path');
var Server = require(path.join(__dirname, 'server', 'server.js'));
var config = require('./config/config')(__dirname);
var server = new Server(config);
server.start();

server.initGlobalVariables();

server.initUtils();

server.connectDb();

server.launchTasks();