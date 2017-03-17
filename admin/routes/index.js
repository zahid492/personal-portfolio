var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var $q = require('q');
var fs=require('fs');
var path=require('path');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var formidable=require('formidable');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

//GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

//REGISTER
router.post('/register', function(req, res, next) {
	if(!req.body.fullname || !req.body.email || !req.body.username || !req.body.password  || !req.body.confirmPassword) {
		return res.status(400).json({ message: 'Please fill out all fields.'});
	}
	if(req.body.password  !== req.body.confirmPassword) {
		return res.status(400).json({message:"Passwords do not match. Please enter your password again." , type : "danger"});
	}
	var result = $q.defer()

	User.find({username: req.body.username}).exec(function(err, users) {
		if(users.length > 0){
			result.reject({message:"This username already exist. Please enter another username." , type : "danger"})
		}else {
			result.resolve()
		}
	});
	User.find({email: req.body.email}).exec(function(err, users) {
		if(users.length > 0){
			result.reject({message:"There is already a registered user with this email . Please enter another email." , type : "danger"})
			
		}else {
			result.resolve()
		}
	});
	result.promise.then(function(){
		var user = new User();
		user.fullname = req.body.fullname;
		user.username = req.body.username;
		user.email = req.body.email;
		user.setPassword(req.body.password);
		
		user.save(function(err) {
			if(err) { return next(err); }
			return res.json({ token: user.generateJWT()})
		});
	}).fail(function(err){
		return res.status(400).json(err)
	})
});

//LOGIN
router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({ message: 'Please fill out all fields'});
	}

	passport.authenticate('local', function(err, user, info){
		if(err) { return next(err); }
		if(user) {
			return res.json({ token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
});

//GET Posts
router.get('/posts', function(req, res, next) {
	Post.find().populate('author').sort({createdOn: -1}).select('_id link title highlites createdOn status author').limit(3).skip(0).exec(function(err, posts) {
		if(err) { return next(err); }

		res.json(posts);
	});
});


router.get('/allposts', function(req, res, next) {
  Post.find({status:1}).populate('author').sort({createdOn: -1}).select('_id link title highlites createdOn status author tags').exec(function(err, posts) {
    if(err) { return next(err); }

    res.json(posts);
  });
});

router.get('/tags', function(req, res, next) {
  Post.find({status:1}).distinct('tags.name').exec(function(err, posts) {
    if(err) { return next(err); }

    res.json(posts);
  });
});


router.get('/searchpostbytag/:tag', function(req, res, next) {
 Post.find({'tags.name':req.params.tag,status:1}).populate('author').sort({createdOn: -1}).select('_id link title highlites createdOn status author tags').exec(function(err, posts) {
    if(err) { return next(err); }

    res.json(posts);
  });
});
//POST Post
router.post('/new-post', auth, function(req, res, next) {
	console.log(req.body);
	if(!req.body.title || !req.body.body ) {
		return res.status(400).json({ message: 'Please fill out all fields.'});
	}

	//db.posts.find({"tags.name":{$in:['Linux']}}).pretty()
	var post = new Post(req.body);

	post.author = req.payload._id;

	post.save(function(err, post){
	 if(err){ return next(err); }
	    res.json(post);
	  });
});

router.param('post', function(req, res, next, id) {
	var query = Post.findOne({'link':id});
  console.log(id);

	query.exec(function(err, post) {
		if(err) { return next(err); }
		if(!post) { return next(new Error('can\'t find post')); }

		req.post = post;
		return next();
	});
});

//GET Single Post
router.get('/posts/:post', function(req, res, next) {
	req.post.populate([{
		path: 'author',
		model: 'User',
	}
	],
	 function(err, post) {
		if(err) { return next(err); }
		res.json(post);
	});	
});

//UPVOTE Post
router.put('/posts/:post/upvote', auth, function(req, res, next) {
	req.post.upvote(function(err, post) {
		if(err) { return next(err); }
		res.json(post);
	});
});

//UPVOTE Post
router.post('/postsiamge/:postId',auth, function(req, res, next) {
     //  console.log("Upload Files");
     // // console.log(req);
     //  var form = new formidable.IncomingForm();
     // // console.log(req.body);
     //  form.parse(req, function(err, fields, files) {
     //    if(err) console.log(err);
       
     //    var file = files.file;
     //    console.log(files);
     //    if (!file) {
     //      res.json({
     //        success: false,
     //        message: 'No Image Found'
     //      });
     //    }
     //    console.log(file);
     //    var tempPath = file.path;
     //    var extension = path.extname(file.name);
     //    var randomNo = Math.floor((Math.random() * 100) + 1);
     //    var targetPath = path.resolve('../../images/blog-image/' + req.params.postId + '_' + randomNo + extension);
     //    fs.rename(tempPath, targetPath, function(err) {
     //      if (err) {
     //        return res.json(err);
     //      }
     //      var image = req.params.postId + '_' + randomNo + extension;
     //      Post.update({
     //        _id: req.params.postId
     //      }, {
     //        $push: {
     //          'images': image
     //        }
     //      }, function(err, data) {
     //        if (err) {
     //          return res.json({
     //            'post': 'Error'
     //          });
     //        } else {
     //          return res.json({
     //            'data': 'success'
     //          });
     //        }
     //      });
     //    });
     //  });
     //  form.on('fileBegin', function(name, file) {
     //  	console.log(file);
     //   });

     //   form.on("file",function(name,file){
     //        console.log("uploaded: " + name);
     //    });
     //    form.on("end",function(){
     //        res.end("Upload complete");
     //    });
     //    form.on('progress', function(bytesReceived, bytesExpected){
     //        var percent = Math.floor(bytesReceived / bytesExpected * 100);
     //        console.log(percent);
     //    });
  // create an incoming form object

  try {
    var crypto=require("crypto");
    console.log("Upload");
    var imagePath='/var/www/sample/personal-portfolio/images/blog-image/';
    console.log(imagePath);
  //  console.log(req.body);

      function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var response = {};
        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        return response;
      }
      // Regular expression for image type:
      // This regular image extracts the "jpeg" from "image/jpeg"
      var imageTypeRegularExpression = /\/(.*?)$/;
      // Generate random string

      var seed = crypto.randomBytes(20);
      var uniqueSHA1String = crypto
        .createHash('sha1')
        .update(seed)
        .digest('hex');
      var base64Data = req.body.image;
      console.log(base64Data);
      var imageBuffer = decodeBase64Image(base64Data);
      console.log(imageBuffer);
      var userUploadedFeedMessagesLocation = imagePath;
      var uniqueRandomImageName = 'image-' + uniqueSHA1String;
      // This variable is actually an array which has 5 values,
      // The [1] value is the real image extension
      var imageTypeDetected = imageBuffer
        .type
        .match(imageTypeRegularExpression);
      var userUploadedImagePath = userUploadedFeedMessagesLocation +
        uniqueRandomImageName +
        '.' +
        imageTypeDetected[1];
      // Save decoded binary image to disk
      console.log(userUploadedImagePath);
      try {
        require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
          function(err) {
          	if(err) return res.json({error:err})

        Post.update({
            _id: req.params.postId
          }, {
            $push: {
              'images':{'image': uniqueRandomImageName + '.' + imageTypeDetected[1]}
            }
          }, function(err, data) {
            if (err) {
              return res.json({
                'post': 'Error'
              });
            } else {
            return res.json({
              status: true,
              image_name: uniqueRandomImageName + '.' + imageTypeDetected[1]
            });
          }
      });

          });
      } catch (error) {
        return res.json({
          status: false,
          'fs_error': error
        });
      }


    } catch (error) {
      callback({
        status: false,
        'error': error
      });
    }


});


//EDIT Post
router.put('/edit-post', auth, function(req, res, next) {
	if(!req.body.title || !req.body.body ) {
		return res.status(400).json({ message: 'Please fill out all fields.'});
	}
	var post = req.body;
	
	Post.findByIdAndUpdate(req.body._id, post, function(err, result) {
  	if (err) { return next(err)};

  	res.json(result);
	});
});

//DELETE Post
router.delete('/delete-post/:id', auth, function(req, res, next) {
	Post.findByIdAndRemove(req.params.id, function(err) {
 		if (err) { return next(err)};
 		res.json("deleted");
	});
});

module.exports = router;

