require('dotenv').config();
const config = require('./config');
const path = require('path');
const express = require('express');
const app = express();

const qs = require('querystring');
const url = require('url');
const request = require('request');

const firebase = require('firebase-admin');

firebase.initializeApp({
	credential: firebase.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY
	}),
	databaseURL: 'https://tweetboss-55090.firebaseio.com'
});

const db = firebase.database();
const ref = db.ref('tweetboss/oauth-data');
const usersRef = ref.child('users');

app.use(express.static('dist'));

app.get('/sign-in', (req, res) => {
	res.sendFile(path.join(__dirname, '../../dist/index.html'), err => {
		if (err) {
			res.status(500).send(err);
		}
	});
});

let oauthToken;
let oauthTokenSecret;

app.get('/api/sign-in', (req, res) => {
	request.post(
		{
			url: 'https://api.twitter.com/oauth/request_token',
			oauth: {
				callback: 'http://localhost:8080/api/oauth/oauth-verifier',
				consumer_key: process.env.CONSUMER_KEY,
				consumer_secret: process.env.CONSUMER_SECRET
			}
		},
		(error, response, body) => {
			const responseData = qs.parse(body);

			oauthToken = responseData.oauth_token;
			oauthTokenSecret = responseData.oauth_token_secret;

			const redirectUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;

			res.send({ redirectUrl: redirectUrl });
		}
	);
});

app.get('/api/oauth/oauth-verifier', (req, res) => {
	const queryData = url.parse(req.url, true).query;

	if (queryData.oauth_token !== oauthToken) {
		res.statusMessage = 'Authentication error';
		res.status(400).end();
	}

	request.post(
		{
			url: 'https://api.twitter.com/oauth/access_token',
			oauth: {
				consumer_key: process.env.CONSUMER_KEY,
				consumer_secret: process.env.CONSUMER_SECRET,
				token: queryData.oauth_token,
				token_secret: oauthTokenSecret,
				verifier: queryData.oauth_verifier
			}
		},
		(error, response, body) => {
			const responseData = qs.parse(body);

			const userId = responseData.user_id;
			const screenName = responseData.screen_name;
			const oauthToken = responseData.oauth_token;
			const oauthTokenSecret = responseData.oauth_token_secret;

			usersRef.child(userId).set({
				screen_name: screenName,
				oauth_token: oauthToken,
				oauth_token_secret: oauthTokenSecret
			});

			res.cookie('userDetails', `userId=${userId}&screenName=${screenName}`, {
				maxAge: 900000
			});

			res.redirect('/'); // TODO: uncomment this redirect for non-dev testing and/or production
			// res.redirect('http://localhost:3000');
		}
	);
});

app.get('/api/user-details', (req, res) => {
	const queryData = url.parse(req.url, true).query;

	usersRef.once('value', data => {
		const snapShot = data.val();

		const userOauthData = snapShot[queryData.user_id];

		request.get(
			{
				oauth: {
					consumer_key: process.env.CONSUMER_KEY,
					consumer_secret: process.env.CONSUMER_SECRET,
					token: userOauthData.oauth_token,
					token_secret: userOauthData.oauth_token_secret
				},
				url: 'https://api.twitter.com/1.1/users/show.json',
				qs: {
					screen_name: queryData.screen_name,
					user_id: queryData.user_id
				},
				json: true
			},
			(error, response, body) => {
				res.send({
					name: body.name,
					screenName: body.screen_name,
					location: body.location,
					description: body.description,
					profileImageUrl: body.profile_image_url_https
				});
			}
		);
	});
});

app.get('/api/timeline', (req, res) => {
	const queryData = url.parse(req.url, true).query;

	usersRef.once('value', data => {
		const snapShot = data.val();

		const userOauthData = snapShot[queryData.user_id];

		request.get(
			{
				oauth: {
					consumer_key: process.env.CONSUMER_KEY,
					consumer_secret: process.env.CONSUMER_SECRET,
					token: userOauthData.oauth_token,
					token_secret: userOauthData.oauth_token_secret
				},
				url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
				qs: {
					screen_name: queryData.screen_name,
					user_id: queryData.user_id
				},
				json: true
			},
			(error, response, body) => res.send(body)
		);
	});
});

app.get('/api/search', (req, res) => {
	const queryData = url.parse(req.url, true).query;

	if (queryData.user_id === 'undefined') {
		res.statusMessage = 'user_id is a required parameter';
		res.status(400).end();
	} else {
		usersRef.once('value', data => {
			const snapShot = data.val();

			const userOauthData = snapShot[queryData.user_id];

			request.get(
				{
					oauth: {
						consumer_key: process.env.CONSUMER_KEY,
						consumer_secret: process.env.CONSUMER_SECRET,
						token: userOauthData.oauth_token,
						token_secret: userOauthData.oauth_token_secret
					},
					url: `https://api.twitter.com/1.1/search/tweets.json`,
					qs: {
						q: queryData.twitter_query
					},
					json: true
				},
				(error, response, body) => res.send(body)
			);
		});
	}
});

app.listen(config.port, () => console.log(`Server listening on port ${config.port}`));
