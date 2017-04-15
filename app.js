"use strict";

let path = require('path');
let Server = require(path.join(__dirname, 'server', 'server.js'));
let config = require('./config/config')(__dirname);
let server = new Server(config);

server.create_folders();

server.start();

server.initGlobalVariables();

server.initUtils();

//server.connectDb();

//server.launchTasks();