// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See meteor-reddit-oauth-tests.js for an example of importing.
export const name = 'meteor-reddit-oauth';

RedditOAuth = {};

OAuth.registerService('reddit', 2, null, q => {

	// check service
	const conf = ServiceConfiguration.configurations.findOne({service: 'reddit'})
	if (!conf) throw new ServiceConfiguration.ConfigError("Service 'reddit' is not configured")

	let res
	try {
		// get access tocken
		res = Meteor.http.post("https://ssl.reddit.com/api/v1/access_token", { 
			auth: [conf.appId, conf.secret].join(':'),
			params: {
				grant_type: 'authorization_code',
				code: q.code,
				redirect_uri: Meteor.absoluteUrl("_oauth/reddit?close")
			}
		}).content;
	} catch (e) {
		throw new Error("Failed to complete OAuth handshake with reddit. " + e.message);
	}

	// res should be JSON, try to parse it
	let parsed
	let accessToken
	let expiresIn
 	try {
    	parsed = JSON.parse(res);

		if (!parsed.access_token) throw new Error("Failed to complete OAuth handshake with reddit -- can't find access token in HTTP response: "+res)
		accessToken = parsed.access_token;
		expiresIn = parsed.expires_in;
	} catch (e) {
		throw new Error("Failed to complete OAuth handshake with reddit: " + res);
	}

	// get identity
	let ident
	let id
  	try {
		ident = Meteor.http.get("https://oauth.reddit.com/api/v1/me", { headers: { "Authorization": 'bearer ' + accessToken, "User-Agent": "Meteor/1.0"} }).data;
		id = ident.name
	} catch (e) {
    	throw new Error("Failed to fetch identity from reddit: "+e.message);
	}
	
	// fields from reddit
	const fields = _.pick(ident, ['name']);

	return {
    	serviceData: {
			id,
			accessToken,
			expiresAt: (+new Date) + (1000 * expiresIn)
		},
	    options: {
    		profile: fields
	    }
  	}
}

RedditOAuth.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret)
};
