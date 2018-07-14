require('dotenv').config();

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

			console.log('RESPONSE DATA ', responseData);

			oauthToken = responseData.oauth_token;
			oauthTokenSecret = responseData.oauth_token_secret;

			const redirectUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;

			res.send({ redirectUrl: redirectUrl });
		}
	);
});

app.get('/api/oauth/oauth-verifier', (req, res) => {
	console.log(req.url);

	const queryData = url.parse(req.url, true).query;

	console.log(
		`Do the two oauth_tokens match? ... ${queryData.oauth_token === oauthToken}`
	);

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

			console.log(responseData);

			const userId = responseData.user_id;
			const screenName = responseData.screen_name;
			const oauthToken = responseData.oauth_token;
			const oauthTokenSecret = responseData.oauth_token_secret;

			usersRef.child(userId).set({
				screen_name: screenName,
				oauth_token: oauthToken,
				oauth_token_secret: oauthTokenSecret
			});

			request.get(
				{
					oauth: {
						consumer_key: process.env.CONSUMER_KEY,
						consumer_secret: process.env.CONSUMER_SECRET,
						token: oauthToken,
						token_secret: oauthTokenSecret
					},
					url: 'https://api.twitter.com/1.1/users/show.json',
					qs: {
						screen_name: screenName,
						user_id: userId
					},
					json: true
				},
				(error, response, body) => console.log(body)
			);

			res.cookie('userDetails', `userId=${userId}&screenName=${screenName}`, {
				maxAge: 900000
			});

			res.redirect('http://localhost:3000');
		}
	);
});

app.listen(8080, () => {
	console.log('Listening on port 8080!');
});
