var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');
var Handlebars = require('hbs');
var moment = require('moment');

var index = require('./routes/index');
var users = require('./routes/users');
var todos = require('./routes/todos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// DEBUG VARIABLE FOR TEMPLATES
Handlebars.registerHelper("debug", function(optionalValue) {
  
   console.log("Current Context");
   console.log("====================");
   console.log(this);
  
  if (optionalValue) {
    console.log("OPTIONAL ARGUMENT VALUE : ");
    console.log("====================");
    console.log(optionalValue);
  }
  
});

// DATE FORMAT FOR TEMPLATES
Handlebars.registerHelper('formatDate', function(date) {
  return moment(date).format('DD/MM/YYYY, h:mm:ss a');
});

// VARIABLES COMPARATORS FOR TEMPLATES
Handlebars.registerHelper({
  eq: function (v1, v2) {
      return v1 === v2;
  },
  ne: function (v1, v2) {
      return v1 !== v2;
  },
  lt: function (v1, v2) {
      return v1 < v2;
  },
  gt: function (v1, v2) {
      return v1 > v2;
  },
  lte: function (v1, v2) {
      return v1 <= v2;
  },
  gte: function (v1, v2) {
      return v1 >= v2;
  },
  and: function (v1, v2) {
      return v1 && v2;
  },
  or: function (v1, v2) {
      return v1 || v2;
  }
});

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());



// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();  
});



// Routes
app.use('/', index);
app.use('/users', users);
app.use('/todo', todos);

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
  res.render('error');
});

module.exports = app;
