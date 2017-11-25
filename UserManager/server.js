var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var debug = require('debug')('UserManagement:server');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)

var cron = require('node-cron');
var StatusFixer = require('./server/modules/StatusFixer')

var config = require("./config");

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/UserManagement', { useMongoClient: true }); // TODO remember to specify username and password in your configuration

var app = express();
var server = require('http').Server(app);

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: config.cookieSecret,
    resave: false,
    saveUninitialized: true,
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: { secure: false } //TODO in production change it to true
}));

// API file for interacting with MongoDB
var api = require('./server/routes/api');

// Parsers
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location 
app.use('/api', api);
// Angular routes
app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/dist/index.html', { root: __dirname });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({status: err.status || 500 });
});

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Set Port
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}


/**
 * Scheduled Task
 */
console.log("Checking logout every "+config.logoutCheck+" minutes.");
 cron.schedule('*/'+config.logoutCheck+' * * * *', function(){
   console.log('Fixing user status');
    StatusFixer.fix();
 })