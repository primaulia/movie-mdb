// requiring the Movie module
var Movie = require('./models/movie');

// require installed modules
var bodyParser = require('body-parser');

// require express module
var express = require('express');

// run express
var app = express();

// set up the port
var port = 5000;
app.set( 'port', port );

// set all the middlewares

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// let's set the routes to list all the movie

// list all movies

app.route('/movies')
    .get( function(req, res) {
      Movie.find({ }).exec(function(err, movies) {
        if(err) return next(err);
        res.json(movies);
      });
    })
    .post( function(req, res) {
      var new_movie = new Movie( req.body );

      new_movie.save(function(err) {
        if(err) return next(err);

        res.json(new_movie);
      });
    });

// listening to the port
app.listen( app.get('port'), function() {
  console.log('running on port: ' + app.get('port') );
});
