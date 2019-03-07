const mongoose = require('mongoose');
const bluebird = require('bluebird');
const validator = require('validator');
const ReferenceProviderModel = require('./model/ReferenceProvider.js');
const ReferenceModel = require('./model/Reference.js');

mongoose.Promise = bluebird;

const mongoString = 'mongourl'; // MongoDB Url

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect id',
});
