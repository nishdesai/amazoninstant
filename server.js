// var throng = require('throng');
// var WORKERS = process.env.WEB_CONCURRENCY || 1;
// console.log('Number of processes/web concurrency: ' + process.env.WEB_CONCURRENCY);
// throng(start, {
//   workers: WORKERS,
//   lifetime: Infinity
// });

// function start() {
    var express = require('express'),
        http = require('http'),
        path = require('path'),
        app = express(),
        config = require('./config'),
        server = require('http').createServer(app),
        io = require('socket.io')(server),
        port = process.env.PORT || 3000,
        Step = require('step');

    var flash = require('connect-flash');

    server.listen(port, function() {
        console.log('Server listening at port %d', port);
    });

    app.configure(function() {
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/app/views/pages');
        app.set('view engine', 'ejs');
        app.use(express.cookieParser());
        app.use(express.cookieSession({
            secret: 'secret'
        }));
        app.use(flash());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    // Database
    // var mongoose = require('mongoose');
    // var mongoUri = process.env.MONGOLAB_URI ||
    //     process.env.MONGOHQ_URL ||
    //     'mongodb://localhost/test';
    // mongoose.connect(mongoUri);
    // var mongo = require('mongodb');
    // mongo.connect(mongoUri, function(err, db) {
    // });

    require('./routes/routes')(app, io);
// }