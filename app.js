var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');

var app = express();

//Import routes
var productRoutes = require('./api/routes/products');
var orderRoutes = require('./api/routes/orders')
var categoryRoutes = require('./api/routes/categories');
var dashboardRoutes = require('./api/routes/dashboard');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

//use routes
app.use('/', dashboardRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes);

app.use(express.static('public'));
app.use(express.static(__dirname + '/public/stylesheets'));
app.use(expressLayouts);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  console.log(err.message)
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
