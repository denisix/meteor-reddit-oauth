# meteor-reddit-oauth
Login service for Meteor based apps using Reddit accounts

# Installation
* meteor add denisix:meteor-reddit-oauth
* create App in reddit developer menu (https://www.reddit.com/prefs/apps) 
* use redirect URI - http://example.com/_oauth/reddit?close
* create server/service.js with the following content, where appId and secret from App created in reddit:
```
ServiceConfiguration.configurations.upsert({ service: 'reddit' }, { $set: { appId: '****', secret: '*****' }});
```
* and then you can use Meteor.loginWithReddit()
