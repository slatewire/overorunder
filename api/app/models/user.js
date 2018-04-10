// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Habit = require('./habit');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var User = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    admin : { type: Boolean, default: false},
    habits: [{
              title: {type: String, required: true},
              startDate: {type: Date, required: true},
              endDate : {type: Date, required: true},
              isDefault: {type: Boolean, default: false},
              over: {type: Number},
              under: {type: Number},
              notSet: {type: Number},
              dates: [{
                      theDate: {type: Date, required: true},
                      dateState: {type: String, default: 'notSet'}
                    }]
            }]
});

User.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



module.exports = mongoose.model('User', User);
