
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var signUpPage = require('./routes/signUpPage');
var afterSignUp = require('./routes/afterSignUp');
var afterSignIn = require('./routes/afterSignIn');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/twitter', signUpPage.signUp);
app.post('/afterSignUp', afterSignUp.checkingDetails);
app.post('/createTablesForUser', afterSignUp.createTablesForUser);
app.get('/signUpSuccess', afterSignUp.signUpSuccess);
app.post('/afterSignIn', afterSignIn.validateCredentials);
app.get('/profile', afterSignIn.loadProfile);
app.post('/profileInfo', afterSignIn.infoDOBUsername);
app.post('/getAllUsernamesInDB', afterSignIn.getAllUsernamesInDB);
app.post('/tweetStoreInDB', afterSignIn.tweetStoreInDB);
app.post('/retreiveTweetFromDB', afterSignIn.retreiveTweetFromDB);
app.post('/addUsernameToFollowing', afterSignIn.addUsernameToFollowing);
app.post('/getfollowing', afterSignIn.getfollowing);
app.post('/getFollowers', afterSignIn.getFollowers);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
