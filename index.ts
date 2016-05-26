import {Server} from 'corona'
import {MouseController} from './app/controllers'
import http = require('http')
import express = require('express')
import repl = require("repl");
var app = express();
var server = http.createServer(app);
server.listen(8080);
app.use(express.static('public'));

var coronaServer = new Server({
  '/*path': MouseController
}, server);

var replServer = repl.start({
    prompt: "game > ",
});

replServer.context.coronaServer = coronaServer;
replServer.on('exit', () => process.exit())
