// models/Users.js

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// schema
var userSchema = mongoose.Schema({
	username:{type:String, required:[true, "Username is required"], unique:true},
	password:{type:String, required:[true, "Password is required"], select:false}, // 171106 select:false 로 할 경우 DB에서 화면으로 불러들이는게 안되는 듯. 내부에서 비교는 되는데, 여튼, view에서 나오지 않음 
	name:{type:String, required:[true, "Name is required"]},
	email:{type:String}
},{
	toObject:{virtual:true}
});

// vertuals
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function() { return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function() { return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function() {return this._newPassword; })
.set(function(value){ this._newPassword=value; })

// password validation
userSchema.path("password").validate(function(v){
	var user = this;

	//create user
	if(user.isNew){
		if(!user.passwordConfirmation){
			user.invalidate("passwordConfirmation", "Password Confirmation is required!");
		}
		if(user.password !== user.passwordConfirmation){
			user.invalidate("passwordConfirmation", "Password Confirmation does not matched!-err1")
		}
	}

	//update user
	if(!user.isNew){
		if(!user.currentPassword){
			user.invalidate("currenPassword", "Current Password is required!");
		}
		if(user.currentPassword && user.currentPassword != user.originalPassword){
			user.invalidate("curretPassword", "Current Password is invalidate!");
		}
		if(user.newPassword !== user.passwordConfirmation){
			user.invalidate("passwordConfirmation", "Password Confirmation does not matched!-err2");
		}
	}
})

// model & export
var User = mongoose.model("user", userSchema);
module.exports = User;
