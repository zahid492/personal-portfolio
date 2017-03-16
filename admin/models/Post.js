var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: String,
	link: String,
	body: String,
	banner:String,
	createdOn: {type : Date, default : Date.now},
	upvotes: {type: Number, default: 0},
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
	tags:[
	  {name:{type : String}}
	],
	images:[
	 {image:{type : String}}
	]
});

PostSchema.methods.upvote = function(cb) {
	this.upvotes += 1;
	this.save(cb);
};

mongoose.model('Post', PostSchema);