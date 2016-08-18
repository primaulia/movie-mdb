var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: true,
    validate: [
      function(password) {
        return password.length >= 6;
      },
      'Password is too short'
    ]
  }
});



userSchema.pre('save', function(next) {
  var user = this;

  // generate the bcrypt salt
  bcrypt.genSalt(5, function(err, salt) {
    if(err) return next(err);

    // create the hash ==> plain password text + salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        // Store hash in your password DB.

        user.password = hash;
        next();
    });
  });
});

userSchema.methods.auth = function(posted_password, callback) {
  console.log('posted_password is: ' + posted_password);

  // comparing
  // 1st arg = posted password from req.body
  // 2nd arg = hashed password from the db
  // 3rd arg = is the callback
  bcrypt.compare( posted_password, this.password, function(err, is_match) {
    callback(null, is_match);
  });
}


var User = mongoose.model('User', userSchema);

module.exports = User;
