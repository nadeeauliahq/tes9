require('dotenv').config(); // Memuat variabel lingkungan dari file .env

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); 
var logger = require('morgan');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var productionRouter = require('./routes/production');
var reportRouter = require('./routes/report');

// Mengimpor sequelize dari models/index.js
var { sequelize } = require('./models/index'); 

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/production', productionRouter);
app.use('/report', reportRouter);

// Sinkronisasi sequelize
sequelize.sync()
  .then(() => {
    console.log('Database connected and synchronized successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
