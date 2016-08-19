var express = require('express'),
    router  = express.Router(),
    jwt = require('jsonwebtoken'),
    jwt_secret = 'supercalifragilisticexpialidocious';

// Movie MDB API Models list

// requiring the Movie module
var Actor = require('../models/actor');
var Director = require('../models/director');
var Movie = require('../models/movie');
var User = require('../models/user');

// signup route
router.post('/signup', function(req, res) {
  // res.send(req.body);
  // set var for the posted requests
  var user_object = req.body;

  var userObject = new User(req.body.user);

  // set new user object
  var new_user = new User(user_object);

  // save the new user object
  new_user.save(function(err, user) {
    if (err) return res.status(400).send(err);

    return res.status(200).send(
      user
      // {
      // message: 'User created'
      // }
    );
  });
});

// login route
router.post('/login', function(req, res) {
  var input_user = req.body;

  // 1. take in the email from req.body
  // 2. find user based on that email
  // 3. get password based on that user
  // 4. compare it with req.body.password

  User.findOne({ email: input_user.email }, function (err, db_user) {
    if(err) res.send(err);

    if(db_user) {
      db_user.auth( input_user.password, function(err, is_match_password) {
        if(err) return res.status(500).send(err);

        if(is_match_password) {
          var payload = {
            id: db_user.id,
            email: db_user.email
          };
          var expiryObj = {
            expiresIn: '3h'
          }
          var jwt_token = jwt.sign(payload, jwt_secret, expiryObj);

          return res.status(200).send(jwt_token);
        } else {
          return res.status(401).send({ message: 'login failed' });
        }
      });
    } else {
      return res.status(401).send({ message: 'user not found in database' });
    }
  })
})

// just for testing
// users route
router.route('/users/:user_id')
  .get(function(req, res) {
  var user_id = req.params.user_id;

  User.findOne({ _id: user_id }, function(err, user) {
    if(err) res.status(400).send(err);

    res.send(user);
  });
})
  .put(function(req, res) {
  var user_id = req.params.user_id;
  var updated_user = new User(req.body);

  updated_user.save(function(err) {
    if (err) return res.status(400).send(err);

    res.send(updated_user);
  });
})

// list all movies

router.route('/movies')
  .get(function(req, res) {
    Movie.find({})
         .populate('actors')
         .populate('director')
         .exec(function(err, movies) {
      if (err) res.status(400).send(err);
      res.json(movies);
    });
  })
  .post(function(req, res, next) {
    var new_movie = new Movie(req.body);

    new_movie.save(function(err) {
      if (err) return res.status(400).send(err);

      res.json(new_movie);
    });
  });

router.route('/movies/:movie_id')
  .get(function(req, res, next) {
    res.json(req.movie);
  })
  .post(function(req, res, next) {
    var movie = req.movie;

    var new_actor = new Actor({ fullName: 'Steve Geluso', email: 'steve@gmail.com'});

    var new_director = new Director({ fullName: 'Rachel Lim' })

    new_director.save(function(err) {
      if(err) res.status(400).send(err);
      movie.director = new_director.id ;
      movie.save(function(err, updated_movie) {
        if(err) res.status(400).send(err);

        res.send({ message: "success update" });
      });
    });
  });

router.route('/actors')
  .get(function(req, res) {
    Actor.find({}).exec(function(err, actors) {
      if (err) res.status(400).send(err);
      res.json(actors);
    });
  })
  .post(function(req, res, next) {
    var new_actor = new Actor(req.body);

    new_actor.save(function(err) {
      if (err) {
        var err_message = {
          "message": err.errors.email.message,
          "status_code": 400
        }


        return res.status(400).send(err);
      }

      res.json(new_actor);
    });
  });

router.route('/actors/:actor_id')
  .get(function(req, res, next) {
    res.json(req.actor);
    // refactoring the queries by param

    // var actor_id = req.params.actor_id;
    // Actor.findOne({
    //   _id: actor_id
    // }, function(err, actor) {
    //   if(err) res.status(400).send(err);
    //
    //   res.json(actor);
    // }
    // );
  })
  .put(function(req, res, next) {
    // console.log(req.body);
    var actor_id = req.actor.id;

    Actor.findByIdAndUpdate(actor_id, req.body, function(err, actor) {
      if (err) res.status(400).send(err);
      Actor.findOne({
        _id: actor_id
      }, function(err, actor) {
        res.json(actor);
      });
    });
  })
  .delete(function(req, res, next) {
    if (err) res.status(400).send(err);

    res.json(req.actor);
  })

// all the router params
router.param('actor_id', function(req, res, next, actor_id) {
  Actor.findOne({
    _id: actor_id
  }, function(err, actor) {
    if (err) res.status(400).send(err);

    req.actor = actor;
    next();
  });
});

router.param('movie_id', function(req, res, next, movie_id) {
  Movie.findOne({
    _id: movie_id
  })
  .populate('actors')
  .populate('director')
  .exec(function(err, movie) {
    if (err) res.status(400).send(err);

    req.movie = movie;
    next();
  });
});

module.exports = router;
