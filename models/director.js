var mongoose = require('mongoose');

// setting up how json structure would be like
var directorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  }
});

// set a virtual attributes
directorSchema.virtual('fullName')
.get(function() {
     return this.firstName + ' ' + this.lastName;
}) // getting the virtual attributes on json view
.set(function(fullName) {
  var splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
}); // allowing virtual attributes to interact with actual mongo attr


// register the modifiers
directorSchema.set('timestamps', {}); // default timestamps by default

// register the Schema
var Director = mongoose.model('Director', directorSchema);

// make this available to our other files
module.exports = Director;
