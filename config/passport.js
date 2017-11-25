var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require("../models/User");
var Userg = require("../models/Userg");
// load the auth variables
var configAuth = require('./auth');


/* Local login & Google OAuth2  둘다에게 필요한 부분인듯 171124 */
// serialize & deserialize User

/*
passport.serializeUser(function(newUserg, done){ // 이런 식으로는 안됨. passport.serializeUserg 가 함수가 아니라고 함 171124
	done(null, newUserg.id);
});
passport.deserializeUserg(function(id, done){
	User.findOne({_id:id}, function(err, userg){
		done(err, userg);
	});
});
*/

// googleOAuth Strategy
console.log("User GoogleStrategy!!")

var userg = passport.use(new GoogleStrategy({

    clientID        : configAuth.googleOAuth.clientID,
    clientSecret    : configAuth.googleOAuth.clientSecret,
    callbackURL     : configAuth.googleOAuth.callbackURL,

},
function(token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {
		console.log("userg nextTick!!")



        // try to find the user based on their google id
        Userg.findOne({ 'googleIdNum' : profile.id }, function(err, userg) {
            if (err)
                return done(err);

            if (userg) {
								console.log("passport.js/ userg :", userg)
                // if a userg is found, log them in
                return done(null, userg);
            } else {
                // if the Userg isnt in our database, create a new user
                var userg          = new Userg();
								console.log("Userg New!!")
                // set all of the relevant information
								//var splitEmail = profile.emails[0].value.split("@");
                userg.googleIdNum    = profile.id;

                //newUserg.google.token = token;
                userg.name  = profile.displayName;
	              userg.email = profile.emails[0].value; // pull the first email

                var id = userg.email.split("@");
                userg.username = id[0];

                //newUserg.password = 'googlegoogle'; // pull the first email

                // save the user
                userg.save()
								.then( r => {
									console.log("Userg save")

                  return done(null, userg);
                });

            }
        });
    });

}));

// local Strategy
var user = passport.use("local-login",
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


if (user.name == null){
	console.log("passport serializeUser user.name :", user.name);
	console.log("passport serializeUser userg.name :", userg.name);
passport.serializeUser(function(userg, done){
	done(null, userg.id);
});
passport.deserializeUser(function(id, done){
	Userg.findOne({_id:id}, function(err, userg){
		done(err, userg);
	});
});   // 여기와 아래 passport.use(new GoogleStrategy( 의 변수 userg를 통일하니, new.ejs에서 user를 받아들임. 아마 위의 두 함수가 반환하는 값이 req.user 에 저장되는 것 같다라는 결론이 이르름 171124
}
else {
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done){
		User.findOne({_id:id}, function(err, user){
			done(err, user);
		});
	});
}


module.exports = passport;
