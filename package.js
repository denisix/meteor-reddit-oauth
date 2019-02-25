Package.describe({
  name: 'denisix:meteor-reddit-oauth',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Login service for Meteor apps using reddit accounts',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/denisix/meteor-reddit-oauth',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.0');
  api.use('ecmascript');
  api.use('oauth', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('service-configuration', ['client', 'server']);
  api.export('RedditOAuth');
  api.addFiles('server.js', 'server');
  api.addFiles('client.js', 'client');
});
