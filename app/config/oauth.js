module.exports = {

  'facebookAuth': {
    'clientID': process.env.FACEBOOKID,
    'clientSecret': process.env.FACEBOOKSECRET,
    'callbackURL': 'http://musecollective.nathanhood.me/auth/facebook/callback'
 },
  'twitterAuth': {
	  'consumerKey': process.env.TWITTERKEY,
		'consumerSecret': process.env.TWITTERSECRET,
		'callbackURL': 'http://musecollective.nathanhood.me/auth/twitter/callback'
	}
};
