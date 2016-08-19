// require mongoose
var mongoose = require('mongoose');

var Actor = mongoose.model("Actor");
var Director = mongoose.model("Director");

// setting up how json structure would be like
var movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  publishedYear: Number,
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  },
  actors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }],
  publisher: {
    type: String,
    default: "MGM"
  },
  website: {
    type: String,
    trim: true,
    get: function(url) {
      if(! url) {
        return url;
      } else {
        if(
          url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0
        ) {
          url = 'http://' + url;
        }

        return url;
      }
    }
  }
},
{
  timestamps: {}
});

// register the getter
movieSchema.set('toJSON', { getters: true } );

// register the Schema
var Movie = mongoose.model('Movie', movieSchema);

// before saving, console.log('saving movie');
movieSchema.pre('save', function(next) {
  console.log('saving movie');
  next();
});

// after saving, console.log('movie saved');
movieSchema.post('save', function() {
  console.log('movie saved');
});

// make this available to our other files
module.exports = Movie;
