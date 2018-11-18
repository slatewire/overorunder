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
var nodemailer = require('nodemailer');

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

//var args = argv.option([
//    {
//      name: 'doOldDates',
//      short: 'y',
//      type: 'boolean'
//    },
//    {
//        name: 'user',
//        short: 'n',
//        type: 'string'
//    },
//    {
//        name: 'over',
//        short: 'o',
//        type: 'int'
//    },
//    {
//        name: 'under',
//        short: 'u',
//        type: 'int'
//    },
//    {
//        name: 'dates',
//        short: 'd',
//        type: 'boolean'
//    },
//    {
//        name: 'habit',
//        short: 'h',
//        type: 'string'
//    }
//]).run()
//
//console.log("the args: ", args);
////console.log("try to unwrap ", args.options.user);
//
//if (args.options.doOldDates) {
//
//  User.findOne({
//    name: args.options.user
//  }, function(err, user) {
//
//    if (err) throw err;
//
//    if (!user) {
//      console.log("No user");
//      return;
//    } else if (user) {
//
//
//      console.log("hellllllo");
//      //return;
//      // now have the users data block - so store a copy
//      var newUser = user;
//      newUser.habits.forEach(function(thisHabit) {
//        if (thisHabit.title === args.options.habit) {
//          // UPDATE according to old state new state etc//
//console.log("Found habit to update");
//          thisHabit["oldOver"] = args.options.over;
//          thisHabit["oldUnder"] = args.options.under;
//console.log("old over: ", args.options.over);
//console.log("THIS HABIT ", thisHabit);
//        }
//      });
//
//console.log("New Data", newUser.habits);
//
//      User.update({name: args.options.user},{$set: {habits: newUser.habits}}, function(err, count, status) {
//
//        if (err) throw err;
//
//        console.log("old over under score set");
//
//      });
//    }
//  });
//}


const randomString = length => {
  let text = "";
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789_-.";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

//const findAllUser = async function () {
//    try {  return await User.find()
//    } catch(err) { console.log(err) }
//}

async function thisUser(name) {

console.log("Passed name ", name)
  let document
    try {
      document = await User.findOne({ name: name })
    } catch (err) {
      logger.error('Mongo error', err)
      return res.status(500).send()
    }
    return document
}

async function league(userRecord, newScore) {

console.log("in league function");

  const myRecord = userRecord;

  let leagueTable = {};
  let league = [];
  let tmpLeague = [];
  let myNewPosn = 0;

  let document
    try {
      document = await User.find({})
    } catch (err) {
      logger.error('Mongo error', err)
      return res.status(500).send()
    }

      document.forEach(function(element, index){
        let name = "";
        let me = false;
        if (!element.screenName) {
          name = element.name.substring(0,2);
        } else {
          name = element.screenName;
        }

        let score = 0;
        let lastPosn = 0;
        if (myRecord.name === element.name) {
          score = newScore;
          if(!myRecord.habits.league) {
            lastPosn = 0;
          } else {
            if (myRecord.habits[0].league.lastPosition) {
              lastPosn = myRecord.habits[0].league.lastPosition
            }
          }
          me = true;
        } else {
          if (!element.habits) {
            if (!element.habits[0].league) {
              score = 0;
            } else {
              score = element.habits[0].league.score;
              lastPosn = element.habits[0].league.lastPosition;
            }
          } else {
            score = 0;
            lastPosn = 0;
          }
          me = false;
        }

        tmpLeague.push({name: name, score: score, lastPosn: lastPosn, me: me});


      });

      tmpLeague.sort((a, b) => b.score - a.score);

      let currentPosn = 0;

      tmpLeague.forEach(function(element, index){

        let newPosn = index + 1;

        if (element.me) {
          myNewPosn = newPosn;
        }

        if (element.lastPosn === newPosn || element.lastPosn === 0) {
          league.push({pos: newPosn, name: element.name, score: element.score, move: "same", me: element.me });
        } else if (element.lastPosn > newPosn) {
          league.push({pos: newPosn, name: element.name, score: element.score, move: "down", me: element.me });
        } else if (element.lastPosn < newPosn) {
          league.push({pos: newPosn, name: element.name, score: element.score, move: "up", me: element.me });
        } else {
          league.push({pos: newPosn, name: element.name, score: element.score, move: "same", me: element.me });
        }
      });

      let update = {score: newScore, lastPosition: myNewPosn};
      let newHabits = myRecord.habits[0];
      newHabits.league = update;

      User.update({name: myRecord.name},{$set: {habits: newHabits}}, function(err, count, status) {
        if (err) throw err;
      });

      leagueTable = {league: league, myNewPosn: myNewPosn};
      return leagueTable;
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

apiRoutes.put('/forgotpass', function(req, res) {

// am using ok error code to display message in app
// should be checking app side if email and not sending if
// not correct and sending error codes back here!
  if (!req.body) return res.status(200).json({success: false, message: ''});
  if (!req.body.email) return res.status(200).json({success: false, message: ''});

  User.findOne({
    name: req.body.email
  }, function(err, user) {

    if (err) return res.status(200).json({success: false, message: 'Email address not found'});

    if (user) {

      const token = randomString(40);
      const emailData = {
        from: 'matthew.denyer@overorunder.io',
        to: req.body.email,
        subject: "OverOrUnder Password Reset Instructions",
        text: `Please use the following link for instructions to reset your password: https://overorunder.io/reset/${token}`,
        html: `<p>Please use the following link for instructions to reset your password:</p><p>https://overorunder.io/reset/${token}</p>`
      };

      User.update({name: req.body.email},{$set: {resetPassLink: token}}, function(err, count, status) {

        if (err) return res.status(200).json({success: false, message: 'Email address not found'});

        console.log("have update db with token success");

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'matthew.denyer@overorunder.io',
            pass: 'over18181818under'
          }
        });

        transporter.sendMail(emailData, function(error, info){
          if (error) {
            console.log(error);
            return res.status(200).json({success: false, message: 'Problem sending the reset email'});
          } else {
            return res.status(200).json({success: true, message: 'An email with instructions on how to reset your passwaord has been sent.'});
          }
        });


      });

    } else if (!user) {
      return res.status(200).json({success: false, message: 'Email address not found'});
    }
  });
});

apiRoutes.post('/resetpass', function(req, res) {
  if (!req.body.code) return res.status(200).json({success: false, message: 'No request code provided'});

  if (req.body.code === '') {
    return res.status(200).json({success: false, message: 'No request code provided'});
  } else {

    User.findOne({
      resetPassLink: req.body.code
    }, function(err, user) {

      if (err) throw err;

      if (user) {
        // we have matched an input reset code to a user request codes
        // so update the PWD
        // if in date TODO
        user.password = req.body.password;
        user.resetPassLink = '';
        user.save(function(err) {
          if (err) throw err;

            return res.status(200).json({success: true, message: 'password has been reset, please login'});
          });

          // else send back out of date message

      } else {
        // send back no user request found
        return res.status(200).json({success: false, message: 'password reset request not found'});
      }
    });
  }

});

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
              expiresIn: 60*60*24*365 // expires in 24 hours
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
              expiresIn: 60*60*24*365 // expires in 24 hours
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

apiRoutes.post('/leagueTable', function(req, res) {


  thisUser(req.decoded.user).then((myUser) =>
    //console.log("THEN ", myUser)
    league(myUser, req.body.score)).catch((err) => {
      console.log("Err ", err)
      throw err
    })
    .then((myLeague) =>
      //console.log("My League", myLeague)
      res.json({ success: true, message: 'return the league', league: myLeague.league})
    ).catch((err) => {
      console.log("Err ", err)
      throw err
    })



});

apiRoutes.get('/userData', function(req, res) {

  User.update({name: "matthew.denyer@slatewire.com"},{$set: {admin: true}}, function(err, count, status) {
    if (err) throw err;

    //console.log("updated status");
  });

    User.findOne({
      name: req.decoded.user
    }, function(err, user) {

      if (err) throw err;

      if (user) {

        res.json({ success: true, message: 'found the user', userData: {habits: user.habits, screenName: user.screenName, admin: user.admin}});
      } else {
        return res.json({ success: false, message: 'Failed to find the user.' });
      }
    });
});


apiRoutes.post('/updateDateState', function(req, res) {

//const myleague = league();

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

apiRoutes.post('/updateScreenName', function(req, res) {

  User.findOne({
    name: req.decoded.user
  }, function(err, user) {

    if (err) throw err;//

    if (user) {
      User.update({name: req.decoded.user},{$set: {screenName: req.body.screenName}}, function(err, count, status) {

        if (err) throw err;

        res.json({ success: true, message: 'screenName updated'});

      });
    }
  });
});

apiRoutes.post('/updateOldScore', function(req, res) {
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
          thisHabit["oldOver"] = req.body.over;
          thisHabit["oldUnder"] = req.body.under;
        }
      });

      User.update({name: req.decoded.user},{$set: {habits: newUser.habits}}, function(err, count, status) {

        if (err) throw err;

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
