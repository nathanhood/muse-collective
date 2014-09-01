module.exports = {

  'facebookAuth': {
    'clientID': process.env.FACEBOOKID,
    'clientSecret': process.env.FACEBOOKSECRET,
    'callbackURL': 'http://musecollective.nathanhood.net/auth/facebook/callback'
 },
  'twitterAuth': {
	  'consumerKey': process.env.TWITTERKEY,
		'consumerSecret': process.env.TWITTERSECRET,
		'callbackURL': 'http://musecollective.nathanhood.net/auth/twitter/callback'
	}
};
