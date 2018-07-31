var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var bodyParser = require('body-parser');

// var session = require('client-sessions');
// var cookieParser = require('cookie-parser');
var session = require('express-session')

var api = new ParseServer({
    databaseURI: process.env.DATABASE_URI, // Connection string for your MongoDB database
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js', // Absolute path to your Cloud Code
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY, // Keep this key secret!
    fileKey: process.env.FILE_KEY,
    serverURL: process.env.SERVER_URL, // Don't forget to change to https if needed
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

console.log(process.env.APP_ID);

var app = express();
// app.use(cookieParser());
app.use(session({
    'store': new session.MemoryStore(),
    'secret': 'this is a secret for the cookie',
    'resave': false,
    'saveUninitialized': false,
    'cookie': {
        'maxAge': 7200000
    } // expired in two hours
}));

app.set('views', 'views');
app.set('view engine', 'ejs');
// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


app.get('/', function(req, res) {
    res.render('pages/whoAmI', {
        active: 'whoAmI'
    });
});

app.get('/signIn', function(req, res) {
    res.render('pages/signIn', {
        active: 'signIn'
    });
});

app.post('/signIn', function(req, res) {
    console.log(req.body.username)
    console.log(req.body.password)
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
        req.session.phoenix = user.getSessionToken();
        res.redirect("/imaging/opencv")
    }).then(null, function(error) {
        console.log("signIn error...", error.message);
        req.session.phoenix = undefined;
    });
});

app.get('/register', function(req, res) {
    res.render('pages/register', {
        active: 'signIn'
    });
});

app.post('/register', function(req, res) {
    var user = new Parse.User();
    user.set("username", req.body.username);
    user.set("password", req.body.password);
    user.set("email", req.body.email);
    user.signUp().then(function(user) {
        res.send(user.get("username"))
    }, function(error) {
        res.send("error")
    })

});

app.get('/planer', function(req, res) {
    res.render('pages/planer', {
        active: 'planer'
    });
});

// app.use('/', function(req, res, next) {
//     let token = req.session.phoenix;
//     if (token === undefined || token === '') {
//         console.log("empty token")
//         res.redirect("/signIn");
//     } else {
//         // console.log("token = " + token);
//         Parse.Cloud.httpRequest({
//             url: Parse.serverURL + '/users/me',
//             headers: {
//                 'X-Parse-Application-Id': process.env.APP_ID,
//                 'X-Parse-Session-Token': token
//             }
//         }).then(function(userData) {
//             req.user = Parse.Object.fromJSON(userData.data);
//             console.log(req.user.get("email"))
//             console.log(req.user)
//             next();
//         }, function(error) {
//             console.log("...authentication error..")
//             req.session.phoenix = undefined;
//             res.redirect("/signIn");
//         });
//     }
// });

app.get('/imaging/opencv', function(req, res) {
    res.render('pages/opencvInstall', {
        active: 'opencvInstall'
    });
});

app.get('/imaging/denoising', function(req, res) {
    res.render('pages/imageDenoising', {
        active: 'imageDenoising'
    });
});

app.get('/imaging/imageDrawing', function(req, res) {
    res.render('pages/imageDrawing', {
        active: 'imageDrawing'
    });
});

app.get('/imaging/edge', function(req, res) {
    res.render('pages/edge', {
        active: 'edge'
    });
});


// var port = process.env.PORT || 1337;
var port = process.env.PORT || 4000;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// // This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);
