var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var bodyParser = require('body-parser');

// var session = require('client-sessions');
// var cookieParser = require('cookie-parser');
var session = require('express-session')
var request = require('request')
var hummus = require('hummus');

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

app.get('/resetPassword', function(req, res) {
    res.render('pages/resetPassword', {
        active: 'signIn'
    });
});

app.post('/resetPassword', function(req, res) {
    console.log(req.body.email)
    res.render('pages/resetPasswordNotification', {
        active: 'signIn'
    });
    // Parse.User.requestPasswordReset(req.body.email, {
    //   success: function() {
    //     // Password reset request was sent successfully
    //     res.render('pages/resetPasswordNotification');
    //   },
    //   error: function(error) {
    //     // Show the error message somewhere
    //     console.log("Error: " + error.message);
    //     res.send("Error: " + error.message);
    //   }
    // });
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

app.get('/web/fullCalendar', function(req, res) {
    res.render('pages/fullCalendar', {
        active: 'fullCalendar'
    });
});

app.get('/web/dataTableData', function(req, res) {
  var dataSet = [
  { index: "", name : "Tiger Nixon", position : "System Architect", office : "Edinburgh", extn : "5421", startD : "2011/04/25", salary : "$320,800" , url: ""},
  { index: "", name : "Garrett Winters", position : "Accountant", office : "Tokyo", extn : "8422", startD : "2011/07/25", salary : "$170,750" , url: "https://www.google.com/"},
  { index: "", name : "Ashton Cox", position : "Junior Technical Author", office : "San Francisco", extn : "1562", startD : "2009/01/12", salary : "$86,000" , url: "https://www.amazon.com/"},
  { index: "", name : "Cedric Kelly", position : "Senior Javascript Developer", office : "Edinburgh", extn : "6224", startD : "2012/03/29", salary : "$433,060" , url: ""},
  { index: "", name : "Airi Satou", position : "Accountant", office : "Tokyo", extn : "5407", startD : "2008/11/28", salary : "$162,700" , url: ""},
  { index: "", name : "Brielle Williamson", position : "Integration Specialist", office : "New York", extn : "4804", startD : "2012/12/02", salary : "$372,000" , url: ""},
  { index: "", name : "Herrod Chandler", position : "Sales Assistant", office : "San Francisco", extn : "9608", startD : "2012/08/06", salary : "$137,500" , url: ""},
  { index: "", name : "Rhona Davidson", position : "Integration Specialist", office : "Tokyo", extn : "6200", startD : "2010/10/14", salary : "$327,900" , url: ""},
  { index: "", name : "Colleen Hurst", position : "Javascript Developer", office : "San Francisco", extn : "2360", startD : "2009/09/15", salary : "$205,500" , url: ""},
  { index: "", name : "Sonya Frost", position : "Software Engineer", office : "Edinburgh", extn : "1667", startD : "2008/12/13", salary : "$103,600" , url: ""},
  ];
  res.send(dataSet)
});

app.get('/web/dataTable', function(req, res) {
    res.render('pages/dataTable', {
        active: 'dataTable'
    });
});

app.get('/web/jsPDF', function(req, res) {
    res.render('pages/jsPDF', {
        active: 'jsPDF'
    });
});

app.get('/web/hummus', function(req, res) {
    res.render('pages/hummus', {
        active: 'hummus'
    });
});

app.get('/web/chartjs', function(req, res) {
    res.render('pages/chartjs', {
        active: 'chartjs'
    });
});

app.get('/web/whiteboard', function(req, res) {
    res.render('pages/whiteboard', {
        active: 'whiteboard'
    });
});

function pdfreader(url, pdfWriter, res){
  if(url.length > 0){
      var options = {
          url: url.pop(),
          method: "get",
          encoding: null
      };
      request(options, function (error, response, body) {
          if (error) {
              console.error('error:', error);
          } else {
              const inStream = new hummus.PDFRStreamForBuffer(body)
              pdfWriter.appendPDFPagesFromPDF(inStream)
              pdfreader(url, pdfWriter, res)
          }
      });
  }else{
    pdfWriter.end();
    res.end();
  }
}

app.get('/web/hummus/pdf', function(req, res) {
  var url1 = "http://localhost:4000/public/pdf/1.pdf"
  var url2 = "http://localhost:4000/public/pdf/2.pdf"
  var url = []
  url.push(url1)
  url.push(url2)

  res.writeHead(200, {'Content-Type': 'application/pdf'});
  var pdfWriter = hummus.createWriter(new hummus.PDFStreamForResponse(res));
  pdfreader(url, pdfWriter, res)
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
