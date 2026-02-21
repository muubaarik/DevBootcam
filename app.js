const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const logger = require('./middleware/loger');
const errorHandler = require('./middleware/error');

const bootcamps = require('./rought/bootcamps');
const courses = require('./rought/courses');
const auth = require('./rought/auth');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(logger);
app.use(fileupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

module.exports = app;
