//Import the mongoose module
var mongoose = require('mongoose');

//Define User Schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  name: String,
  boughtSongs: {
    type: [String],
    default: []
  }, 
  uploadedSongs: {
    type: [String],
    default: []
  }
});

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
}
