var express = require('express'),
    router  = express.Router(),
    jwt = require('jsonwebtoken'),
    jwt_secret = 'supercalifragilisticexpialidocious';

// Movie MDB API Models list

// requiring the Movie module
var Movie = require('../models/movie');
var Actor = require('../models/actor');
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
  var loggedin_user = req.body;

  User.findOne(
    { email: loggedin_user.email },
    function(err, found_user) {
      // this is error find flow
      if (err) return res.status(400).send(err);

      found_user.authenticate(loggedin_user.password, function(err, isMatch) {
        // console.log('password comparison is: ', isMatch);
        if (isMatch) {
          // return res.status(200).send({message: "Valid credentials !"});
          var payload = {
            id: found_user.id,
            email: found_user.email
          };
          var expiryObj = {
            exp: 60 * 3
          }
          var jwt_token = jwt.sign(payload, jwt_secret, { expiresIn : 60*3 });

          return res.status(200).send(jwt_token);
        } else {
          return res.status(401).send({message: "Login failed"});
        };
      });

      // if (found_user) {
        // var payload = {
        //   id: found_user.id,
        //   email: found_user.email
        // };
        // var expiryObj = {
        //   exp: 60 * 3
        // }
        // var jwt_token =
        //   // jwt.sign(payload, jwt_secret, expiryObj);
        //   jwt.sign(payload, jwt_secret, { expiresIn : 60*3 });
        //
        //
        // return res.status(200).send(jwt_token);
      // } else {
      //   // this is login failed flow
      //   return res.status(400).send({
      //     message: 'login failed'
      //   });
      // }
    });
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
    Movie.find({}).exec(function(err, movies) {
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

router.param('actor_id', function(req, res, next, actor_id) {
  Actor.findOne({
    _id: actor_id
  }, function(err, actor) {
    if (err) res.status(400).send(err);

    req.actor = actor;
    next();
  });
});

module.exports = router;
