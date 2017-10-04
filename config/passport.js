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
      console.log(user);
      if (err) {
        console.log("qwerqwerqwr");
        return next(err);
      }

      if (!user) {
        return next(null, false, {
          message: 'Incorrect email'
        });
      }
      console.log(user.password);
      if (!bcrypt.compareSync(password, user.password)) {
        console.log("inside bcrypt")
        return next(null, false, {
          message: 'Incorrect password'
        });
      }
      console.log("final things");
      return next(null, user);
    });
  }));
}

module.exports = configure;
