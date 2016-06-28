'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var cors = require('cors');

var rootDir = path.join(__dirname);
var appDir = path.join(rootDir);

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(appDir, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(appDir, 'public')));
app.use(express.static(path.join(appDir, 'download')));
//设置跨域访问
//var corsOptions = {
//	origin: ["http://localhost:9000", "http://localhost:8080", "http://localhost:3000", /\.kaihei\.wang$/],
//	allowedHeaders: "Origin, Content-Type, Content-Length, Accept, X-Requested-With, Authorization, version, client-type, game, if-none-match",
//	methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//	credentials: true
//};
//app.options('*', cors(corsOptions), function (req, res, next) {
//	res.sendStatus(200);
//});
//app.use(cors(corsOptions));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(errorHandler());
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.set('port', process.env.PORT || 9000);

var server = app.listen(app.get('port'), function () {
	console.log('server listening on port ' + server.address().port);
});
