var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var api = new ParseServer({
  databaseURI: process.env.DATABASE_URI, // Connection string for your MongoDB database
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js', // Absolute path to your Cloud Code
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY, // Keep this key secret!
  fileKey: process.env.FILE_KEY,
  serverURL: process.env.SERVER_URL, // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
app.set('views', 'views');
app.set('view engine', 'ejs');
// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

app.get('/plan', function(req, res) {
  res.render('pages/calendar');
});


var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
