var express = require('express');
var app = express();
var port = process.env.PORT || 3000
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var io = require('socket.io')(server)
var server = require('http').createServer(app)

var configDB = require('./config/database');
var expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

//database setup
mongoose.connect(configDB.url);

require('./config/passport')(passport)

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({ secret: 'JustTheTwoOfUsMakingCastlesInTheSky' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

require('./app/routes.js')(app, passport);

app.engine('ejs', require('ejs').renderFile);
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

// app.listen(port);
// console.log('Server up on port', port);

//REPLACES APP.LISTEN ABOVE
server.listen(port, function() {
  console.log('server has started on port %s', port)
})

io.on('connection', function(socket){
  socket.on('chat', function(message) { //channel = 'chat' //on = listening for event
    console.log('Receiving')
    console.log(message.messageContent)
    io.emit('chat', { messageReceived: message })
  })
})
