const mongoose = require('mongoose');
const bluebird = require('bluebird');
const validator = require('validator');
const ReferenceProviderModel = require('./model/ReferenceProvider.js');

mongoose.Promise = bluebird;

const mongoString = 'mongodb://rfpawsmongo:RMD8h394o2aExsQAo3eB4yUUHrrhLizqxCyXruu6gMeRsKPNfK4POUHVdbQsscJ48xxqT6DAAwf1cUiT9rjo2A==@rfpawsmongo.documents.azure.com:10255/?ssl=true'; // MongoDB Url

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect id',
});
module.exports.referenceprovider = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    db.close();
    return;
  }

  db.once('open', () => {
    ReferenceProviderModel
      .find({ _id: event.pathParameters.id })
      .then((referenceprovider) => {
        callback(null, { statusCode: 200, body: JSON.stringify(referenceprovider) });
      })
      .catch((err) => {
        callback(null, createErrorResponse(err.statusCode, err.message));
      })
      .finally(() => {
        // Close db connection or node event loop won't exit , and lambda will timeout
        db.close();
      });
  });
};
//admin functionality 
module.exports.getAllReferenceProviders = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  db.once('open', () => {
    ReferenceProviderModel
      .find()
      .then((referenceprovider) => {
        callback(null, { statusCode: 200, body: JSON.stringify(referenceprovider) });
      })
      .catch((err) => {
        callback(null, createErrorResponse(err.statusCode, err.message));
      })
      .finally(() => {
        // Close db connection or node event loop won't exit , and lambda will timeout
        db.close();
      });
  });
};

//createreferenceprovider

module.exports.createReferenceProvider = (event, context, callback) => {
  let db = {};
  let data = {};
  let errs = {};
  let reference = {};
  const mongooseId = '_id';

  db = mongoose.connect(mongoString).connection;

  data = JSON.parse(event.body);

  referenceprovider = new ReferenceProviderModel({ name: data.name,
    name: data.name,
    created_date: data.created_date,
    lastupdated_date: data.created_date,
    reference_seekers: data.reference_seekers,
    reference_receivers: data.reference_receivers,
    references: data.references,
    ip: event.requestContext.identity.sourceIp });

  errs = referenceprovider.validateSync();

  if (errs) {
    console.log(errs);
    callback(null, createErrorResponse(400, 'Incorrect reference data'));
    db.close();
    return;
  }


  db.once('open', () => {
    referenceprovider
      .save()
      .then(() => {
        callback(null, { statusCode: 200, body: JSON.stringify({ id: referenceprovider[mongooseId] }) });
      })
      .catch((err) => {
        callback(null, createErrorResponse(err.statusCode, err.message));
      })
      .finally(() => {
        db.close();
      });
  });
};
//updatereferenceprovider
//deletereferenceprovider

//getreferenceseekers
//addreferenceseeker
//updatereferenceseeker
//delete referenceseeker
//getreferencereceivers
//addreferencereceiver
//updatereferencereceiver
//deletereferencereceiver
