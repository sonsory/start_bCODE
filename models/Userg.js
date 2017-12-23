// models/Users.js

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var bcrypt = require("bcrypt-nodejs");

var usergSchema = mongoose.Schema({
	loginType:{type:String

	},
	googleIdNum:{
		type:String
	},
	username:{
		type:String
	}, // 171106 select:false 로 할 경우 DB에서 화면으로 불러들이는게 안되는 듯. 내부에서 비교는 되는데, 여튼, view에서 나오지 않음
	name:{
		type:String,
		required:true
	},
	email:{
		type:String
	}/*,
	createdAt:{
		type:Date,
		default:Date.now
	}*/
	},{
	toObject:{virtual:true}
});


console.log("model/Userg.js 실행")
var Userg = mongoose.model('userg', usergSchema); //mongoose.model('userg', 의 userg가 userg로 수정 되어야할 수도 171124
module.exports = Userg;
