const mongoose = require('mongoose');
const validator = require('validator');


const model = mongoose.model('ReferenceReceiver', {
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: false,
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
  references: [{
    type: Schema.ObjectId,
    ref: 'Reference' 
  }],
  reference_seeker: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  reference_providers: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
});

module.exports = model;