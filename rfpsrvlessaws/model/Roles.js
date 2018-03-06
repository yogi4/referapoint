const mongoose = require('mongoose');
const validator = require('validator');
//change this to using RBAC or ABAC ( attribute based access control)
//use this library https://github.com/onury/accesscontrol

const model = mongoose.model('Roles', {
  role_name: {
    type: String,
    required: false,
  },
  role_type: {
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
  
});

module.exports = model;