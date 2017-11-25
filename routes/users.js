// routes/users.js

var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Userg = require("../models/Userg");
var util = require("../util");

// Index
router.route("/").get(function(req, res){
	User.find({})
	.populate("userg")
	.sort({username:1})
	.exec(function(err, users){
		if(err) return res.json(err);
		res.render("users/index", {users:users, userg:userg});
	});
});

// New
router.get("/new", function(req, res){
	var user= req.flash("user")[0] || {};
	var errors = req.flash("errors")[0] || {};
	res.render("users/new", {user:user, errors:errors });
});

// Create
router.post("/", function(req, res){
	User.create(req.body, function(err, user){
		if(err) {
			req.flash("user", req.body);
			req.flash("errors", util.parseError(err))
			return res.redirect("/users/new");
		}
		res.redirect("/users");
	});
});

// Show
router.get("/:username", function(req, res){
	User.findOne({username:req.params.username}, function(err, user){
		if(err) return res.json(err);
		res.render("users/show", {user:user});
	});
});

// edit
router.get("/:username/edit", function(req, res){
  var user = req.flash("user")[0];
  var errors = req.flash("errors")[0] || {};
  if(!user){
    User.findOne({username:req.params.username}, function(err, user){
      if(err) return res.json(err);
      res.render("users/edit", { username:req.params.username, user:user, errors:errors });
    });
  } else {
    res.render("users/edit", { username:req.params.username, user:user, errors:errors });
  }
});

// Update
router.put("/:username", function(req, res, next){
	//console.log("req : ", req, " res : ", res) 171111
	User.findOne({username:req.params.username})
	.select({password:1})
	.exec(function(err, user){
		if(err) return res.json(err);

		user.originalPassword = user.password;
		user.password = req.body.newPassword? req.body.newPassword : user.password;
		for(var p in req.body){
			user[p] = req.body[p];
		}

		// save updated user
		user.save(function(err, user){
			if(err) {
				req.flash("user", req. body);
				req.flash("errors", util.parseError(err));
				return res.redirect("/users/"+req.params.username+"/edit");
			}
			res.redirect("/users/"+req.params.username);
		});
	});
});


router.get("/aaa", function(req, res){
  res.send('what?');
});

module.exports = router;



/* 171104 표현하기가 쉽지 않은데,
걍 생각나는 대로 적어본다면
/routes 안의 home.js posts.js users.js는 모두
module.export = router; 로 export된다.
그리고

/routes/home.js에서
router.get("/", function(req, res){ ...

/routes/posts.js에서
router.get("/", function(req, res){

/routes/users.js에서
router.route("/").get(function(req, res){

위의 세개의 파일에 존재하는 router들은 동일한 경로 즉, 경로 "/"로 들어오는 요청에 동일하게 반응을 하고 있다.

즉, 위의 내용들로 유추해보건대, router.어쩌구.저쩌구 등은 여러번 중복해서 사용가능하고, 이들 모두 동일요청에 한꺼번에 반응하며
그 결과값(요청된 값)등을 window 객체? 라고 해야하나? .. 여튼 해당경로의 어떤, 어딘가에 뿌려주고,
해당 경로에 반응하는, 또는 반응해야하는 페이지들에서 필요한 값을 가져갈 수 있게, 사용할 수 있게 해준다고 생각된다.
특히 ejs등 파일을 렌더링할때!!
*/
