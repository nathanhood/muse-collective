module.exports = {

  'facebookAuth': {
    'clientID': process.env.FACEBOOKID,
    'clientSecret': process.env.FACEBOOKSECRET,
    'callbackURL': 'http://localhost:3000/auth/facebook/callback'
 },
  'twitterAuth': {
	  'consumerKey': process.env.TWITTERKEY,
		'consumerSecret': process.env.TWITTERSECRET,
		'callbackURL': 'http://localhost:3000/auth/twitter/callback'
	}
};
