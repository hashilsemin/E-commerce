var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var db = require('./config/connection')
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var venderRouter = require('./routes/vendor');
const passport = require('passport')
const mongoClient = require('mongodb').MongoClient
var jwt = require('jsonwebtoken');
var app = express();
const flash = require('express-flash')
const session = require('express-session')
var fileUpload=require('express-fileupload')
// view engine setup
app.use(fileUpload())
app.use(flash())



//...


app.use(session({ cookie: { maxAge: 600000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));
app.use(passport.initialize())
app.use(passport.session())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(passport.initialize())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partial'}))
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/vendor', venderRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
db.connect((err)=>{
  if(err){
    console.log("not succesfull");
  }else{
    console.log("sucesfull");
  }
})
module.exports = app;
