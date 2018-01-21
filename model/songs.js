'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//create new instance of the mongoose.schema. the schema takes an 
//object that shows the shape of your database entries.
var SongSchema = new Schema({
 artist: String,
 email:String,
 title: String,
 address: String,
 url: String,
 imageURL: String,
 timesPlayed: {
 	type: Number,
 	default: 0
 }
});
//export our module to use in server.js
module.exports = mongoose.model('Songs', SongSchema);