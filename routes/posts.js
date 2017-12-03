// routes/posts.js

var express = require("express");
var router = express.Router();
var Post = require("../models/Post");
var util = require("../util");
//
// // Index
// router.get("/", function(req, res){
//   Post.find({})
//   .populate("author")
//   .sort("-createdAt")
//   .exec(function(err, posts){
//     if(err) return res.json(err);
//     res.render("posts/", {posts:posts});
//   });
// });


router.get("/", /*util.isLoggedin,*/ function(req, res){
  var post = req.flash("post")[0] || {};
  var errors = req.flash("errors")[0] || {};
  var user = req.user;console.log("post.js router.get/new req.user : ", req.user);
  var userg = req.userg;console.log("req.userg : ", req.userg);

  //console.log("res.username : ", res.username);
  Post.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
  res.render("posts/new", { post:post, posts:posts, errors:errors, user:user, userg:user });
  });
});

//이건 nh 테스트 용, ex, http://localhost:4000/posts/nh
router.get("/nh", /*util.isLoggedin,*/ function(req, res){
  var post = req.flash("post")[0] || {};
  var errors = req.flash("errors")[0] || {};
  var user = req.user;console.log("post.js router.get/new req.user : ", req.user);
  var userg = req.userg;console.log("req.userg : ", req.userg);

  //console.log("res.username : ", res.username);
  Post.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
  res.render("posts/new_nh", { post:post, posts:posts, errors:errors, user:user, userg:user });
  });
});


// New
router.get("/new", /*util.isLoggedin,*/ function(req, res){
  var post = req.flash("post")[0] || {};
  var errors = req.flash("errors")[0] || {};
  var user = req.user;console.log("post.js router.get/new req.user : ", req.user);
  var userg = req.userg;console.log("req.userg : ", req.userg);
  //console.log("res.username : ", res.username);
  Post.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
    console.log("posts[2] :", posts[2]);
    console.log("posts.length :", posts.length);


  res.render("posts/new", { post:post, posts:posts, errors:errors, user:user, userg:user });
  });
});



router.get("/index", /*util.isLoggedin,*/ function(req, res){

  res.render("posts/index");
  });

router.get("/aaa", function(req, res){   //router.get 으로 했을때는 작동, router.post로 했을 때는 작동안함... 아마 폼에서 post로 날려줘야 할 듯;;
  //var post = req.flash("post")[0] || {};
  //var errors = req.flash("errors")[0] || {};
  console.log("비코드 체크!!")
  var a = [1,1,1,1,1,1,1,1,1];
  console.log("req.body.bcode : ", req.body.bcode);
  Post.findOne({bcode:'1,1,1,0,1,1,1,1,1'}, function(err, post){
   if(err) return res.json(err);
  console.log(post);
  res.redirect(post.link)
  //res.render("posts/test", { a:post.link});

  });
});





// create
router.post("/", util.isLoggedin, function(req, res){
  req.body.author = req.user._id;
  //console.log("req.user._id = ", req.user._id);
  Post.create(req.body, function(err, post){
    if(err){
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/new");
    }
    res.redirect("/posts");
  });
});






// show
router.get("/:id", function(req,res){
  Post.findOne({_id:req.params.id})
    .populate("author")
    .exec(function(err, post){
    if(err) return res.json(err);
    res.render("posts/show", {post:post});
  });
});

// Edit
router.get("/:id/edit", util.isLoggedin, checkPermission, function(req,res){
  var post = req.flash("post")[0];
  var errors = req.flash("errors")[0] || {};
  if(!post){
    Post.findOne({_id:req.params.id}, function(err, post){
      if(err) return res.json(err);
      res.render("posts/edit", { post:post, errors:errors });
    });
  } else {
    post._id = req.params.id;
    res.render("posts/edit", { post:post, errors:errors });
  }
});

// Update
router.put("/:id", util.isLoggedin, checkPermission, function(req, res){
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
    if(err){
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/"+req.params.id+"/edit");
    }
    res.redirect("/posts/"+req.params.id);
  })
})

// destroy
router.delete("/:id", util.isLoggedin, checkPermission, function(req, res){
  Post.remove({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect("/posts");
  });
});








module.exports = router;


// private function

function checkPermission(req, res, next){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    if(post.author != req.user.id) return util.noPermission(req, res);

    next();
  })
}

//
// function checkBcode(req, res){
//
//   })
// }
