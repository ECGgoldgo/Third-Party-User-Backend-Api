const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var db = require("../config/db");
var revxUsers = require("../app/modules/revx/schemas/revxUsersSchema");

module.exports = async function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = db.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log("jwt_payload", jwt_payload);
      console.log(jwt_payload.id);
      revxUsers.findByPk(jwt_payload.id)
        .then(async (user) => {
          // console.log('user.dataValues.is_login:',user.dataValues.is_login);
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err, false);
        });
    })
  );
};
