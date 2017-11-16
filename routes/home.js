// routes/home.js

var express = require("express");
var router = express.Router();
var passport = require("../config/passport");


// Home
router.get("/", function(req, res){
  res.render("home/welcome");
});
router.get("/about", function(req, res){
  res.render("home/about");
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
  res.redirect("/");
});



module.exports = router;
