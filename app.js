const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swagger = require('swagger-ui-express');
const logger = require('./helpers/winston').logger('app.js');
const helmet = require('helmet');

const app = express();
// eslint-disable-next-line import/order
require('dotenv').config();
const db = require('./db/db');
const { errorHandler } = require('./helpers/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
const corsOption = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: '204',
};
app.use(cors(corsOption));
app.use('/api/docs', swagger.serve, swagger.setup(require('./swagger.json')));
app.use('/api', require('./routes/index'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log('In 404********************');
  next(createError(404));
});

// error handler
app.use(errorHandler);
db.connect().then(() => {
}).catch((error) => {
  console.log('error in connection ', error.message);
});

app.listen('5000', () => {
  logger.info('Server listening on 5000');
});

module.exports = app;
