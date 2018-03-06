const mongoose = require('mongoose');
const validator = require('validator');

const model = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    validate: {
      validator(name) {
        // noinspection JSAnnotator
          return validator.isAlphanumeric(name);
      },
    },
  },
  firstname: {
    type: String,
    required: true,
    validate: {
      validator(firstname) {
        return validator.isAlphanumeric(firstname);
      },
    },
  },
  lastname: {
    type: String,
    required: true,
    validate: {
      validator(lastname) {
        return validator.isAlphanumeric(lastname);
      },
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  phone: {
    type: String,
    required: false,
  },
  birth: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
    validate: {
      validator(city) {
        return validator.isAlphanumeric(city);
      },
    },
  },
  //this has to be driven by API too and make this an array
  usertype: {
    type: String,
    enum: ['person','software','solopreneur','organization']

  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Roles',
    required: false,
  }],
  created_date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  lastupdated_date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  ip: {
    type: String,
    required: true,
    validate: {
      validator(ip) {
        return validator.isIP(ip);
      },
    },
  },
});

module.exports = model;
