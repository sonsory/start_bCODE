// routes/home.js

var express = require("express");
var router = express.Router();
var passport = require("../config/passport");
// 171125 이하 추가 - 네비게이션바에 구글 인증 넣으면서.. 문제가 생감;;;
var User = require("../models/User");
var Userg = require("../models/Userg");
var util = require("../util");


// Home
router.get("/", function(req, res){
  res.render("posts");
});

/*
router.get("/about", function(req, res){
  res.render("home/about");
});
*/

//171125 수정
router.get("/about", function(req, res){
	User.findOne({username:req.params.username}, function(err, user){
		if(user!=null){ //로컬 로그인시 171125
			if(err) return res.json(err);
			res.render("home/about", {user:user});
		} else { //구글 로그인시 171125 ... 위의 것들도 다 이렇게 해줘야 한다는 건가;;; ㅎㄸㄷ;;;; 이것 뭔가 크게 잘못된 듯 ㅋㅋ
			Userg.findOne({username:req.params.username}, function(err, user){
				if(err) return res.json(err);
				res.render("home/about", {user:user});
			});
		}
	});
});



router.get("/shot", function(req, res){
  res.send('what?');
});


// Login
router.get("/login", function (req, res){
    var username = req.flash("username")[0];
    var errors = req.flash("error")[0] || {};
  console.log("username : ", username); //171111
  res.render("home/login", {
    username:username,
    errors:errors
  });
});


// Post Login
router.post("/login",
  function(req, res, next){
    var errors = {};
    var isValid = true;
    if(!req.body.username){
      isValid = false;
      errors.username = "Username is required!";
    }
    if(!req.body.password){
      isValid = false;
      errors.password = "Password is required!";
    }
    if(isValid){
      next();
    } else {
      req.flash("errors", errors);
      res.redirect("/login");
    }
  },
  passport.authenticate("local-login", {
    successRedirect : "/posts/new",
    failureRedirect : "/login"
  })
);

// Logout
router.get("/logout", function(req, res){
  var username = req.flash("username")[0];

  //console.log("username : ", res.body)
  req.logout();
  console.log("로그아웃됨!")
  res.redirect("posts");
});


router.put('/changeNickName/:id', isLoggedIn, function(req, res){
  if(req.user._id != req.params.id) return res.json({success:false, message:"Unauthrized Attempt"});

  User.findById( req.params.id )
  .then( r => {
    if( null == r) {
      throw "Not found User"
    }

    return User.findByIdAndUpdate( req.params.id, { "$set": { "nickname": req.body.nickname, "url": req.body.url } } )
    .then( r => {
      return res.json( { success:"true"} )
    })

  })
  .catch( e => {
    return res.json({success:"false", message:err});
  })
})
/* Start of the Google OAuth2 */
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user

router.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/posts',
                failureRedirect : '/posts'
        }));

/* End of the Google OAuth2 */

module.exports = router;


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('posts/new');
}
