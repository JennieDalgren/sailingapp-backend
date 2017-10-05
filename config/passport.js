const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user').User;

function configure(passport) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    user = user ? new User(user) : null;
    done(null, user);
  });
  passport.use(new LocalStrategy({usernameField: 'email'},(email, password, next) => {
    User.findOne({
      email
    }, (err, user) => {

      if (err) {
        return next(err);
      }

      if (!user) {
        return next(null, false, {
          message: 'Incorrect email'
        });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {
          message: 'Incorrect password'
        });
      }
    
      return next(null, user);
    });
  }));
}

module.exports = configure;
