/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'your secret here'
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
    socket.on('do input', function(msg) {
        socket.json.emit('done input', msg);
        socket.json.broadcast.emit('done input', msg);
    });
    socket.on('do commit', function(msg) {
        socket.json.emit('done commit', msg);
        socket.json.broadcast.emit('done commit', msg);
    });
});
