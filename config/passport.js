var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require("../models/User");
var Userg = require("../models/Userg");
// load the auth variables
var configAuth = require('./auth');
/*
passport.serializeUser(function(user, done){
	console.log('serialize user');
	done(null, user.id);
});
passport.deserializeUser(function(id, done){
	console.log('deserialize user');
	User.findOne({_id:id}, function(err, user){
		done(err, user);
	});
});


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

/*var userg = */passport.use(new GoogleStrategy({

    clientID        : configAuth.googleOAuth.clientID,
    clientSecret    : configAuth.googleOAuth.clientSecret,
    //callbackURL     : configAuth.googleOAuth.callbackURL, // localhost
		callbackURL    : configAuth.googleOAuth.callbackURL,  // 13code.com

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
								//var user = userg;
								//console.log("passport.js/ userg -> user :", user)
                return done(null, userg);
            } else {
                // if the Userg isnt in our database, create a new user
                var userg          = new Userg();
								console.log("Userg New!!")
                // set all of the relevant information
								//var splitEmail = profile.emails[0].value.split("@");
                userg.loginType      = "googleOAuth"
                userg.googleIdNum    = profile.id;

                //newUserg.google.token = token;
                userg.name  = profile.displayName;
	              userg.email = profile.emails[0].value; // pull the first email

                var id = userg.email.split("@");
                userg.username = id[0];
								//var user = userg;

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

//console.log("ex>passport serializeUser user.name :", user.name);
//console.log("ex>passport serializeUser userg.name :", userg.name);
/*
if (user.name == null){
	console.log("passport serializeUser user.name :", user.name);
	console.log("passport serializeUser userg.name :", userg.name);
*/
passport.serializeUser(function(user, done){
	console.log('serialize userg', user);
	done(null, user.id);
});
passport.deserializeUser(function(id, done){
	console.log('dserialize userg');

	//Userg = User;
	Userg.findOne({_id:id}, function(err, user){
		//console.log("user.googleIdNum : ", user.googleIdNum)  // 이런
		if(user != null){  //if(user.name != null) 또는 if(user.googleIdNum != null) 이런 조건을 달 경우, 애초에 Userg 에서 어떤 값도 긁어오지 못하는 상태에서는 null 에러가 난다. 여기서는 그냥 user가 null인지 아닌지만 보면 됨.
		done(err, user);
		} else {
			User.findOne({_id:id}, function(err, user){
				done(err, user);
			});
		}
	});
});   // 여기와 아래 passport.use(new GoogleStrategy( 의 변수 userg를 통일하니, new.ejs에서 user를 받아들임. 아마 위의 두 함수가 반환하는 값이 req.user 에 저장되는 것 같다라는 결론이 이르름 171124
	// google OAuth가 done(err, useg)로, userg를 반환하더라도 serializeUser 및 deserializeUser는 첫번째 콜백함수의 인자로 무조건 받아들임. 변수명 인수명 등 따위 관계없는 듯. 	그리고 최종적으로 req.user 로 값을 반환 171125
/*
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
*/

module.exports = passport;
