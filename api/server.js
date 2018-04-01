// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var cors        = require('cors');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var validator   = require("email-validator");
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

// =======================
// configuration =========
// =======================
app.use(cors());
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});


// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/validate', function(req, res) {

  var token = req.body.token;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        res.json({
          success: true,
          message: 'you have a valid token'
        });
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }

});

apiRoutes.post('/signup', function(req, res) {

  // first check it is a valid email address
  if(!validator.validate(req.body.name)) {
    res.json({ success: false, message: 'Invalid email address'});
  } else {

    User.findOne({
      name: req.body.name
    }, function(err, user) {

      if (err) throw err;

      if (user) {
        res.json({ success: false, message: 'User already has an account.'});
      } else if (!user) {

        // create a sample user
        var newUser = new User({
          name: req.body.name,
          password: req.body.password,
          admin: false
        });

        // save the sample user
        newUser.save(function(err) {
          if (err) throw err;

          const payload = {
            user: newUser.name
          };
          var token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 60*60*24 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        });
      }
    });
  }
});

apiRoutes.post('/authenticate', function(req, res) {

  if(!validator.validate(req.body.name)) {
    res.json({ success: false, message: 'Invalid email address'});
  } else {

    // find the user
    User.findOne({
      name: req.body.name
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

      // check if password matches
//      if (user.password != req.body.password) {
//        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
//      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) {
            res.json({ success: false, message: 'Error.' });
          }
          if (isMatch === false) {
              res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {


          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
            const payload = {
              admin: user.admin
            };
            var token = jwt.sign(payload, app.get('superSecret'), {
              expiresIn: 60*60*24 // expires in 24 hours
            });

          // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }
        });
      }
    });
  }
});

// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});


// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);



// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
