
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , https = require('https');

https.globalAgent.keepAlive=true;
https.globalAgent.maxSockets=25;

var app = express();

var apiKey = require('./private');
console.log(apiKey);



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/loaderio-foobar/', user.tokens);

app.get('/search_test', function(req, res, next) {
  getClientTicket(function(data) {
  res.json({'success': true, 'ticket':data});
});
});

var getClientTicket = function(cb) {
https.request({
'hostname': 'jettestarmpaas.cloudapp.net',
'path': '/api/Account/ClientTicket',
'headers': {
'JetAPIKey': apiKey
}
}, function(response) {
var resz = '';
response.on('data', function(chunk) {
resz += chunk;
});

response.on('error', function() {
cb();
});

response.on('end', function() {
  console.log('here');
  console.log(resz);
try {
  var res = JSON.parse(resz);
  console.log(res);

} catch(e) {
  console.log('couldnt parse');
  console.error(e.message);
  res = { errMessage: e.message, data:resz};
}
cb(res);
});
}).end();
};


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
