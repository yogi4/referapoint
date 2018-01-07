const mongoose = require('mongoose');
const bluebird = require('bluebird');
const validator = require('validator');
const ReferenceModel = require('./model/Reference.js');

mongoose.Promise = bluebird;

const mongoString = 'mongodb://rfpawsmongo:RMD8h394o2aExsQAo3eB4yUUHrrhLizqxCyXruu6gMeRsKPNfK4POUHVdbQsscJ48xxqT6DAAwf1cUiT9rjo2A==@rfpawsmongo.documents.azure.com:10255/?ssl=true'; // MongoDB Url

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect id',
});

module.exports.reference = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    db.close();
    return;
  }

  db.once('open', () => {
    ReferenceModel
      .find({ _id: event.pathParameters.id })
      .then((reference) => {
        callback(null, { statusCode: 200, body: JSON.stringify(reference) });
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

module.exports.getAllReferences = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  db.once('open', () => {
    ReferenceModel
      .find()
      .then((reference) => {
        callback(null, { statusCode: 200, body: JSON.stringify(reference) });
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
module.exports.createReference = (event, context, callback) => {
  let db = {};
  let data = {};
  let errs = {};
  let reference = {};
  const mongooseId = '_id';

  db = mongoose.connect(mongoString).connection;

  data = JSON.parse(event.body);

  reference = new ReferenceModel({ name: data.name,
    name: data.name,
    created_date: data.created_date,
    lastupdated_date: data.created_date,
    type: data.type,
    reference_seeker: data.reference_seeker,
    reference_receiver: data.reference_receiver,
    reference_provider: data.reference_provider,
    status: data.status,
    reference_notes: data.reference_notes,
    reference_text: data.reference_text,
    ip: event.requestContext.identity.sourceIp });

  errs = reference.validateSync();

  if (errs) {
    console.log(errs);
    callback(null, createErrorResponse(400, 'Incorrect reference data'));
    db.close();
    return;
  }


  db.once('open', () => {
    reference
      .save()
      .then(() => {
        callback(null, { statusCode: 200, body: JSON.stringify({ id: reference[mongooseId] }) });
      })
      .catch((err) => {
        callback(null, createErrorResponse(err.statusCode, err.message));
      })
      .finally(() => {
        db.close();
      });
  });
};

module.exports.deleteReference = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    db.close();
    return;
  }

  db.once('open', () => {
    ReferenceModel
      .remove({ _id: event.pathParameters.id })
      .then(() => {
        callback(null, { statusCode: 200, body: JSON.stringify('Ok') });
      })
      .catch((err) => {
        callback(null, createErrorResponse(err.statusCode, err.message));
      })
      .finally(() => {
        db.close();
      });
  });
};


module.exports.updateReference = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  const data = JSON.parse(event.body);
  const id = event.pathParameters.id;
  let errs = {};
  let reference = {};

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    db.close();
    return;
  }


  reference = new referenceModel({ _id: id,
    name: data.name,
    lastupdated_date: Date.now(),
    reference_seeker: data.reference_seeker,
    reference_receiver: data.reference_receiver,
    reference_provider: data.reference_provider,
    status: data.status,
    reference_notes: data.reference_notes,
    reference_text: data.reference_text,
    ip: event.requestContext.identity.sourceIp });

  errs = reference.validateSync();

  if (errs) {
    callback(null, createErrorResponse(400, 'Incorrect parameter'));
    db.close();
    return;
  }
db.once('open', () => {
    // ReferenceModel.save() could be used too
    ReferenceModel.findByIdAndUpdate(id, reference)
      .then(() => {
        callback(null, { statusCode: 200, body: JSON.stringify('Ok') });
      })
      .catch((err) => {
        callback(err, createErrorResponse(err.statusCode, err.message));
      })
      .finally(() => {
        db.close();
      });
  });
};
module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
