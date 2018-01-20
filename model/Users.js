'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//create new instance of the mongoose.schema. the schema takes an 
//object that shows the shape of your database entries.
var UsersSchema = new Schema({
 user: String,
 password: String //gotta do hash
});

//export our module to use in server.js
module.exports = mongoose.model('Users', UsersSchema);