const mongoose = require('mongoose');
const validator = require('validator');


const model = mongoose.model('Reference', {
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
  type: {
    type: String,
    required: true,
  },
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
  reference_seeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reference_receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,

  },
  reference_provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    required: true,
    //add enum 
  },
  reference_notes: {
    type: Object,

  },

  reference_text: {
    type: String,
    required: true,
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

  //reference_seeker
  //reference_receiver
  //reference_provider 
});

module.exports = model;