var express = require("express"),
	webserver = express(),
	socketServer = require('http').createServer(handler),
	io = require('socket.io').listen(socketServer),
	fs = require('fs'),
	exec = require('child_process').exec,
	config = require('./appconfig');

//sockets
socketServer.listen(config.socketServerPort);
//express / html
webserver.listen(config.webServerPort);

webserver.use(express.bodyParser());

//I don't honestly know why I need one of these..  TODO: look that up.
var handler = function(req, res){};

//ROUTING:  set up routes for the paths we want public.
webserver.get("/", function(req, res){
	res.render(__dirname + '/views/index.ejs', {
		layout:false,
		locals: { cacheKey: '?t=' + (new Date()).getTime() }
	});
});
	
webserver.use('/static', express.static(__dirname + '/static'));


io.sockets.on('connection', function (socket) {

	socket.on('click', function(data){
		if (typeof data.command !== 'undefined'){
			console.log(data.command);
			
			exec(config.keyboardEmulator + " " + data.command,function(err,stdout,stderr){
				if (err){
					console.log(err);
				}
			})
		}
	});
	
});

