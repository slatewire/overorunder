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
var argv = require( 'argv' );

// get our mongoose model
var User   = require('./app/models/user');

// This line is from the Node.js HTTPS documentation.
if (process.env.ENVIRONMENT === 'production') {

  var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/overorunder.io/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/overorunder.io/cert.pem')
  };
}




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

////////////////////////////////////
// Admin Function first

var args = argv.option([
    {
      name: 'doOldDates',
      short: 'y',
      type: 'boolean'
    },
    {
        name: 'user',
        short: 'n',
        type: 'string'
    },
    {
        name: 'over',
        short: 'o',
        type: 'int'
    },
    {
        name: 'under',
        short: 'u',
        type: 'int'
    },
    {
        name: 'dates',
        short: 'd',
        type: 'boolean'
    },
    {
        name: 'habit',
        short: 'h',
        type: 'string'
    }
]).run()

console.log("the args: ", args);
//console.log("try to unwrap ", args.options.user);

if (args.options.doOldDates) {

  User.findOne({
    name: args.options.user
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      console.log("No user");
      return;
    } else if (user) {


      console.log("hellllllo");
      //return;
      // now have the users data block - so store a copy
      var newUser = user;
      newUser.habits.forEach(function(thisHabit) {
        if (thisHabit.title === args.options.habit) {
          // UPDATE according to old state new state etc//
console.log("Found habit to update");
          thisHabit["oldOver"] = args.options.over;
          thisHabit["oldUnder"] = args.options.under;
console.log("old over: ", args.options.over);
console.log("THIS HABIT ", thisHabit);
        }
      });

console.log("New Data", newUser.habits);

      User.update({name: args.options.user},{$set: {habits: newUser.habits}}, function(err, count, status) {

        if (err) throw err;

        console.log("old over under score set");

      });
    }
  });
}






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

        var startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        var endDate = new Date(2019, 0, 1, 0, 0, 0, 0);

        var theDates = [];
        //var aDate = new Date();
        var dateString = "";

        for (var d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          //var dString = d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
          //aDate=d;
          //aDate.setHours(0,0,0,0);

          const dayOrMonth = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];


          var year = d.getFullYear();
          var month = d.getMonth();
          var day = d.getDate() -1;
          dateString = year + "-" + dayOrMonth[month] + "-" + dayOrMonth[day];

          var newOverUnderDate = {
            //theDate: new Date(aDate),
            theDate: dateString,
            dateState: 'notSet'
          };
          theDates.push(newOverUnderDate);
        }

        var newHabit = {
          title: 'drinking',
          startDate: startDate,
          endDate: endDate,
          isDefault: true,
          over: 0,
          under: 0,
          notSet: 7,
          oldOver: 0,
          oldUnder: 0,
          dates: theDates
        };

        var habits = [];
        habits.push(newHabit);

        // create a sample user
        var newUser = new User({
          name: req.body.name,
          password: req.body.password,
          admin: false,
          habits: habits
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
            var token = token;
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

        user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) {
            res.json({ success: false, message: 'Error.' });
          }
          if (isMatch === false) {
              res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

            const payload = {
              admin: user.admin,
              user: user.name
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

  User.findOne({
    name: req.decoded.user
  }, function(err, user) {

    if (err) throw err;

    if (user) {
      res.json({ success: true, message: 'found the user', user: user});
    } // else if (!user) {}
  });

  //User.find({}, function(err, users) {
  //  res.json(users);
  //});
});


apiRoutes.get('/userData', function(req, res) {

    User.findOne({
      name: req.decoded.user
    }, function(err, user) {

      if (err) throw err;

      if (user) {

        res.json({ success: true, message: 'found the user', habits: user.habits});
      } else {
        return res.json({ success: false, message: 'Failed to find the user.' });
      }
    });
});


apiRoutes.post('/updateDateState', function(req, res) {

  User.findOne({
    name: req.decoded.user
  }, function(err, user) {

    if (err) throw err;//

    if (user) {
      // now have the users data block - so store a copy
      var newUser = user;
      newUser.habits.forEach(function(thisHabit) {
        if (thisHabit.title === req.body.habit) {
          // UPDATE according to old state new state etc//

          thisHabit.dates.forEach(function(thisDate, index) {

//            var passedDate = new Date(req.body.date);
//            passedDate.setHours(0,0,0,0);

//            checkDate = thisDate.theDate.setHours(0,0,0,0);
//            var previous = new Date (checkDate);
//            var nextD = new Date (checkDate);
//            previous.setDate(previous.getDate()-1);
//            nextD.setDate(nextD.getDate()+1);

//            if ((passedDate > previous) && (passedDate < nextD)) {
            if (thisDate.theDate === req.body.date) {

                var oldState = thisDate.dateState;
                thisDate.dateState = req.body.newState;
                // change the state stuff

                if(req.body.newState === 'good') {
                  if(oldState === 'notSet') {  // notSet to good
                    thisHabit.notSet = thisHabit.notSet - 1;
                    thisHabit.over = thisHabit.over + 1;
                  } else { // it is bad to good
                    thisHabit.under = thisHabit.under - 1;
                    thisHabit.over = thisHabit.over + 1;
                  }
                } else {  // it is bad state
                  if(oldState === 'notSet') { // notSet to Bad
                    thisHabit.notSet = thisHabit.notSet - 1;
                    thisHabit.under = thisHabit.under + 1;
                  } else { // good to bad
                    thisHabit.over = thisHabit.over - 1;
                    thisHabit.under = thisHabit.under + 1;
                  }
                }
            }
          });
        }
      });

      User.update({name: req.decoded.user},{$set: {habits: newUser.habits}}, function(err, count, status) {

        if (err) throw err;

        res.json({ success: true, message: 'user data updated'});

      });
    }
  });
});


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);



// =======================
// start the server ======
// =======================
// Create an HTTP service.

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
