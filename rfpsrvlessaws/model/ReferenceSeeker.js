const mongoose = require('mongoose');
const validator = require('validator');


const model = mongoose.model('ReferenceSeeker', {
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: false,
  },
  references: [{
    type: Schema.ObjectId,
    ref: 'Reference' 
  }],
  },
});

module.exports = model;