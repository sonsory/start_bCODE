// models/Post.js

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var util = require("../util");


// schema
var postSchema = mongoose.Schema({
  title:{type:String, required:[true, "Title is required!"]},
  bcode:{type:String, required:[true, "bCODE is required!"]},
  link:{type:String, required:[true, "Link is required!"]},
  body:{type:String, required:[true, "Body is required!"]},
  author:{type:mongoose.Schema.Types.ObjectId, ref:"user", /*required:true */}, //171215
  authorg:{type:mongoose.Schema.Types.ObjectId, ref:"userg", /*required:true */}, //171215
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true}
});

// virtuals
postSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

postSchema.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});

postSchema.virtual("updatedDate")
.get(function(){
  return util.getDate(this.updatedAt);
})

postSchema.virtual("updatedTime")
.get(function(){
  return util.getTime(this.updatedAt);
})

// model & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;
