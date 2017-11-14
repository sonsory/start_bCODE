var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require("../models/User");

// serialize & deserialize User
passport.serializeUser(function(user, done){
	done(null, user.id);
});
passport.deserializeUser(function(id, done){
	User.findOne({_id:id}, function(err, user){
		done(err, user);
	});
});


// local Strategy
passport.use("local-login",
	new LocalStrategy({
			usernameField : "username",
			passwordField : "password",
			passReqToCallback : true
		},
		function(req, username, password, done){
			User.findOne({username:username})
			.select({password:1})
			.exec(function(err, user){
				if (err) return done(err);
				console.log("여기는 실행되나?");
				if (user && user.authenticate(password)) {
					return done(null, user);
				} else {
					req.flash("username", username);
					req.flash("errors", {login: "Incorrect username or password"});
					return done(null, false);
				}
			});
		}
	)
);


module.exports = passport;
