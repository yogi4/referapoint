const mongoose = require('mongoose');
const bluebird = require('bluebird');
const validator = require('validator');
const ReferenceProviderModel = require('./model/ReferenceProvider.js');
const ReferenceModel = require('./model/Reference.js');

mongoose.Promise = bluebird;


//TODO: YOGI This entire handler needs revisiting 
//const mongoString = 'mongodb://rfpawsmongo:RMD8h394o2aExsQAo3eB4yUUHrrhLizqxCyXruu6gMeRsKPNfK4POUHVdbQsscJ48xxqT6DAAwf1cUiT9rjo2A==@rfpawsmongo.documents.azure.com:10255/?ssl=true'; // MongoDB Url
const mongoString = 'mongodb://rfpawsmongo:cMyREDTklx7gFotLX0P0XAoZipWuP4nXLSI1y0J3PgJxD8gcq5zRb9pMmVT9TERyfrElGRZHnDzYfxstWT19ig==@rfpawsmongo.documents.azure.com:10255/?ssl=true'; // MongoDB Url

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
    references: data.references, //if available - fix this to get any references associated with this provider 
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
module.exports.updateReferenceProvider = (event, context, callback) => {
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


  referenceprovider = new ReferenceProviderModel({ _id: id,
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
//deletereferenceprovider
//admin functionality
module.exports.deleteReferenceprovider = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    db.close();
    return;
  }

  db.once('open', () => {
    ReferenceProviderModel
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
//getreferenceseekers
module.exports.getReferenceSeekers = (event, context, callback) => {
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
      .then((reference_seekers) => {
      	// build a JSON string response for reference seekers 
        callback(null, { statusCode: 200, body: JSON.stringify(referenceprovider.reference_seekers) });
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
//addreferenceseeker
//updatereferenceseeker
//delete referenceseeker
//getreferencereceivers

//This is wrong => get all reference receivers for this Reference Provider 
module.exports.getReferenceReceivers = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    db.close();
    return;
  }
// the id has to be context based 
  db.once('open', () => {
    ReferenceProviderModel
      .find({ _id: event.pathParameters.id })
      .then((reference_receivers) => {
      	// build a JSON string response for reference seekers 
        callback(null, { statusCode: 200, body: JSON.stringify(referenceprovider.reference_receiver) });
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
//addreferencereceiver
//updatereferencereceiver
//deletereferencereceiver

//get references by reference provider // move this to reference provider ???? 
module.exports.getReferencesByReferenceProvider = (event, context, callback) => {
  const db = mongoose.connect(mongoString).connection;
  const id = event.pathParameters.id;


  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    db.close();
    return;
  }

  db.once('open', () => {
    ReferenceModel
      .find({ reference_provider: event.pathParameters.id })
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
