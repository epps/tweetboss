module.exports = {
	firebasePrivateKey:
		process.env.NODE_ENV === 'production'
			? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
			: process.env.FIREBASE_PRIVATE_KEY,
	oauthVerifierCallbackUrl:
		process.env.NODE_ENV === 'production'
			? 'https://tweetboss.herokuapp.com/api/oauth/oauth-verifier'
			: 'http://localhost:8080/api/oauth/oauth-verifier',
	redirectOnOAuthSuccessUrl: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000',
	port: process.env.PORT || 8080
};
