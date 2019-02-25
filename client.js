RedditOAuth = {};
RedditOAuth.requestCredential = (opts, callback) => {
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  const conf = ServiceConfiguration.configurations.findOne({service: 'reddit'});
  if (!conf) {
    callback && callback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }

  const token = Random.id(),
        loginStyle = OAuth._loginStyle('steam', conf, opts),
        state = OAuth._stateParam(loginStyle, token),
        uri = encodeURIComponent(Meteor.absoluteUrl('_oauth/reddit?close'));

  let scope = ['read'];
  if (opts && opts.requestPermissions) scope = opts.requestPermissions.join(',')

  OAuth.initiateLogin(token, 'https://ssl.reddit.com/api/v1/authorize'+
      '?client_id='+conf.appId+
      '&response_type=code'+
      '&state='+state+
      '&redirect_uri='+uri+
      '&duration=permanent'+
      '&scope='+scope, 
      callback, {});
};
