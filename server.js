//server.js
'use strict'

//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
//and create our instances
var app = express();
var router = express.Router();
var Post = require('./model/posts');
var User = require('./model/users').User;
var Song = require('./model/songs');
//set our port to either a predetermined port number if you have set 
//it up, or 3001
var port = process.env.API_PORT || 3001;

mongoose.connect('mongodb://Pranav:password@ds121696.mlab.com:21696/users');
//now we should configure the API to use bodyParser and look for 
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache');
 next();
});
//now we can set the route path & initialize the API
router.get('/', function(req, res) {
 res.json({ message: 'API Initialized!'});
});

router.route('/buySong').post(function(req, res) {
	var email = req.query.email;
	var song = req.query.song;
	User.findOne({email: email}, function(err, user) {
		console.log(user);
		user.boughtSongs.push(song);
		user.save(function(err) {
			if(err) {
				console.log(err);
			}
		});
	})
});

router.route('/getAddress').get(function(req, res) {
	var title = req.query.title;
	Song.findOne({title: title}, function(err, song) {
		console.log(song);
		res.send(song);
	});
});

router.route('/search').get(function(req, res) {
	var term = req.query.term;
	Song.find({$or:[{title : {$regex : term}}, {artist : {$regex : term}}]}, function(err, songs) {
		res.send(songs);
	});
});

router.route('/getSongs').get(function(req, res) {
	var email = req.query.email;
	User.find({email: email}, function(err, users) {
		if(users.length !== 0) {
			Song.find({url: users[0].uploadedSongs}, function(err, songs){
				Song.find({url: users[0].boughtSongs}, function(err, moresongs) {
					res.send({uploaded: songs, bought: moresongs});
				})
			});
		}
		//res.send({owned: users[0].boughtSongs, uploaded: users[0].uploadedSongs});
	});
});

router.route('/user').post(function(req, res) {
	var email = req.body.email;
	var person = req.body.person;
	User.find({email: email}, function(err, users) {
		if(users.length == 0) {
			var user = new User();
			user.email = email;
			user.name = person;
			user.save(function(err) {
				if(err) {
					console.log(err) 
				} else {
					console.log('added user');
				}
			})
		}
	})
});

router.route('/addSong').post(function(req, res) {
	User.find({name: req.body.artist}, function(err, users) {
		users[0].uploadedSongs.push(req.body.url);
		users[0].save(function(err) {
			if(err) {
				console.log(err);
			}
		})
	});
	var song = new Song();
	song.artist = req.body.artist;
	song.email = req.body.email;
	song.title = req.body.title;
	song.url = req.body.url;
	song.imageURL = req.body.imageURL;
	song.address = req.body.address;
	song.timesPlayed = req.body.timesPlayed;
	song.save(function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('added');
		}
	})
});
//adding the /posts route to our /api router
router.route('/posts')
 //retrieve all comments from the database
 .get(function(req, res) {
 //looks at our Post Schema
 Post.find(function(err, posts) {
 if (err)
 res.send(err);
 //responds with a json object of our database comments.
 res.json(posts)
 });
 })
 //post new post to the database
 .post(function(req, res) {
 var post = new Post();
 //body parser lets us use the req.body
 post.author = req.body.author;
 post.post = req.body.post;
 post.title = req.body.title;
 post.time = req.body.time;
 post.key = req.body.key;
post.save(function(err) {
 if (err)
res.send(err);
res.json({ message: 'Post successfully added!' });
	 });
 });

//Use our router configuration when we call /api
//...
app.use('/api', router);
//starts the server and listens for requests
app.listen(port, function() {
 console.log('api running on port ' + port);
});