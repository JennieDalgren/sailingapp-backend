const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const cors         = require('cors');
const multer       = require('multer');
const session      = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport     = require('passport');

const configure = require('./config/passport');
const responses = require('./helpers/response');

const trips = require('./routes/trips');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost/sailing');

app.use(session({
  secret: 'sailing-app',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  allowedHeaders: ['Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

configure(passport);

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  //console.log("incoming request", req.method, req.path, req.cookies);
  next();
})

app.use('/auth', auth);
app.use('/users', users);
app.use('/trips', trips);

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

  responses.unexpectedError(req, res, err);
});

module.exports = app;
