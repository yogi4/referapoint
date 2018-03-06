const mongoose = require('mongoose');
const bluebird = require('bluebird');
const validator = require('validator');
const ReferenceProviderModel = require('./model/ReferenceProvider.js');
const ReferenceModel = require('./model/Reference.js');

mongoose.Promise = bluebird;

//const mongoString = 'mongodb://rfpawsmongo:RMD8h394o2aExsQAo3eB4yUUHrrhLizqxCyXruu6gMeRsKPNfK4POUHVdbQsscJ48xxqT6DAAwf1cUiT9rjo2A==@rfpawsmongo.documents.azure.com:10255/?ssl=true'; // MongoDB Url
const mongoString = 'mongodb://rfpawsmongo:cMyREDTklx7gFotLX0P0XAoZipWuP4nXLSI1y0J3PgJxD8gcq5zRb9pMmVT9TERyfrElGRZHnDzYfxstWT19ig==@rfpawsmongo.documents.azure.com:10255/?ssl=true'; // MongoDB Url

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect id',
});