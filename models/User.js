// models/Users.js

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var bcrypt = require("bcrypt-nodejs");

// schema
var userSchema = mongoose.Schema({
	loginType:{type:String

	},
	username:{
		type:String,
		required:[true, "Username is required"],
		match:[/^.{4,12}$/, "Should be 4-12 characters!"],
		trim:true,
		unique:true
	},
	password:{
		type:String,
		required:[true, "Password is required"],
		select:false
	}, // 171106 select:false 로 할 경우 DB에서 화면으로 불러들이는게 안되는 듯. 내부에서 비교는 되는데, 여튼, view에서 나오지 않음
	name:{
		type:String,
		required:[true, "Name is required"],
		match:[/^.{4,12}$/, "Should be 4-12 characters!"],
		trim:true
	},
	email:{
		type:String,
		match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/, "Should be a valid email address!"],
		trim:true
	},
	userg:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"userg"
	}
	},{
	toObject:{virtual:true}
});

console.log("Local Login")
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
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/
var passwordRegexErrorMessage = "Should be minimum 8 characters of alphabet and number combination!";
userSchema.path("password").validate(function(v){
	var user = this;

	//create user
	if(user.isNew){
		if(!user.passwordConfirmation){
			user.invalidate("passwordConfirmation", "Password Confirmation is required!");
		}
		if(!passwordRegex.test(user.password)){
			user.invalidate("password", passwordRegexErrorMessage);
		} else if(user.password !== user.passwordConfirmation){
			user.invalidate("passwordConfirmation", "Password Confirmation does not matched!-err1")
		}
	}

	//update user
	if(!user.isNew){
		if(!user.currentPassword){
			user.invalidate("currenPassword", "Current Password is required!");
		}
		if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)) {
			user.invalidate("curretPassword", "Current Password is invalidate!");
		}
		if(user.newPassword && !passwordRegex.test(user.newPassword)){
			user.invalidate("newPassword", passwordRegexErrorMessage);
		} else if(user.newPassword !== user.passwordConfirmation){
			user.invalidate("passwordConfirmation", "Password Confirmation does not matched!-err2");
		}
	}
});

// hash password
userSchema.pre("save", function(next){
	var user = this;
	if(!user.isModified("password")){
		return next();
	} else {
		user.password = bcrypt.hashSync(user.password);
		return next();
	}
});

// model methods
userSchema.methods.authenticate = function (password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};


// model & export
var User = mongoose.model("user", userSchema);
module.exports = User;
