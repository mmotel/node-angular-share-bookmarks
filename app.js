var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var passport = require('passport');

//socket.io server
var Socket = require('./server/socket.js');

//mongodb driver wrapper
var MONGO_URL = 'mongodb://localhost:27017/testdb';
var MONGO_OPLOG_URL =
  'mongodb://oplogger:superhaslo123@localhost:27017/local?authSource=admin';

var Manager = require('./server/manager.js')( MONGO_URL );

//oplog
var Oplog = require('./server/oplog.js');

//setup passport
require('./server/passport.js')( passport, Manager );

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(session({ secret: 'ng-secret' }));
app.use(session({ secret: 'ng-secret', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.logger());

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//socket startup
var socketio = require('socket.io');
var io = socketio.listen( server );
//socket server startup
Socket.listen(server, Manager, MONGO_URL, MONGO_OPLOG_URL, io);

//oplog startup
Oplog(server, MONGO_URL, MONGO_OPLOG_URL, io);

//setup auth rest api
require('./server/authrestapi.js')( app, passport, Manager );

//setup rest api
require('./server/restapi.js')( app, Manager );
