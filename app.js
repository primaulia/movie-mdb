// CONSTANT VARIABLE, DON'T CHANGE
var mongo_url = 'mongodb://localhost/mymdb_db';
var jwt_secret = 'supercalifragilisticexpialidocious';

// require mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongo_url)

// require installed modules
var bodyParser  = require('body-parser');
var expressJWT  = require('express-jwt');
var jwt         = require('jsonwebtoken');

// require express module
var express = require('express');

// run express
var app = express();

// set up the port
var port = 5000;
app.set('port', port);

// set all the middlewares

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// express-jwt
app.use(
  expressJWT({
    secret: jwt_secret
  })
  .unless({
    path: [ '/signup', '/login' ]
  })
);

// Movie MDB API Models list

// requiring the Movie module
var Movie = require('./models/movie');
var Actor = require('./models/actor');
var User = require('./models/user');

// let's set the routes to list all the movie

// signup routes
app.post('/signup', function(req, res) {
  // res.send(req.body);
  // set var for the posted requests
  var user_object = req.body;

  var userObject = new User(req.body.user);

  // set new user object
  var new_user = new User(user_object);

  // save the new user object
  new_user.save( function(err, user) {
    if( err ) return res.status(400).send(err);

    return res.status(200).send({
      message: 'User created'
    });
  });
});

app.post('/login', function(req, res) {
  var loggedin_user = req.body;

  User.findOne(
    loggedin_user
    , function(err, found_user) {
      // this is error find flow
      if(err) return res.status(400).send(err);

      if(found_user) {
        var payload = found_user.id;
        var expiryObj = {
          expiryInMinutes: 60
        }
        var jwt_token =
        jwt.sign(payload, jwt_secret, expiryObj);

        return res.status(200).send(jwt_token);
      } else {
        // this is login failed flow
        return res.status(400).send({ message: 'login failed'});
      }
  });
})




// list all movies

app.route('/movies')
  .get(function(req, res) {
    Movie.find({}).exec(function(err, movies) {
      if (err) return next(err);
      res.json(movies);
    });
  })
  .post(function(req, res, next) {
    var new_movie = new Movie(req.body);

    new_movie.save(function(err) {
      if (err) res.send(400, err);

      res.json(new_movie);
    });
  });

app.route('/actors/:actor_id')
    .get( function(req, res, next) {
      var actor_id = req.params.actor_id;
      Actor.findOne({
        _id: actor_id
      }, function(err, actor) {
        if(err) return next(err);

        res.json(actor);
      }
      );
    })
    .put( function(req, res, next) {
      // console.log(req.body);
      var actor_id = req.params.actor_id;

      Actor.findByIdAndUpdate( actor_id, req.body, function(err, actor) {
        if(err) return next(err);

        res.json(actor);
      });
    });


app.route('/actors')
  .get(function(req, res) {
    Actor.find({}).exec(function(err, actors) {
      if (err) return next(err);
      res.json(actors);
    });
  })
  .post(function(req, res, next) {
    var new_actor = new Actor(req.body);

    new_actor.save(function(err) {
      if (err) {
        console.log(
          'error message is: ' + err.errors.email.message
        );
        var err_message =
        {
          "message": err.errors.email.message,
          "status_code": 400
        }


        return res.status(400).send(err);
      }

      res.json(new_actor);
    });
  });

// listening to the port
app.listen(app.get('port'), function() {
  console.log('running on port: ' + app.get('port'));
});
