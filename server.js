var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {};


var bodyParser = require('body-parser')
var fs = require('fs');
var stringifyFile = '';

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName,
            imageUrl: profile._json.image.url,
            email: profile.emails[0].value
        };
        cb(null, profile);
    }
));

app.use(bodyParser.json());
app.use(express.static('assets'));

//app routes
app.get('/', function(req, res) {
    res.render('index', {
        //user: { name: "Johnny", age: "20" },
        name: "Moja dynamiczna strona",
        url: "http://www.google.com"
    });
});

app.get('/logged', function(req, res){
    //console.log(googleProfile);
    res.render('logged', { user: googleProfile });

});


app.get('/auth/google', passport.authenticate(
    'google',
    {
        scope: ['profile', 'email']
    }
));

app.get('/auth/google/callback', passport.authenticate(
    'google',
    {
        successRedirect: '/logged',
        failureRedirect: '/'
    }
));



//-------------------------------------

app.use('/store', function(req, res, next) {
    console.log('Hej, jestem pośrednikiem między żądaniem a odpowiedzią!');
    next();
});

app.get('/getNote', function(req, res) {
    console.log('Otrzymałem żądanie GET do strony /getNote');

    fs.readFile('./test.json', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        stringifyFile = data;
        res.send(data);
    });
});

/*
app.get('/', function(req, res) {
    console.log('Otrzymałem żądanie GET do strony głównej');
    res.sendFile('/index.html');
});
*/

app.get('/store', function(req, res) {
    console.log('go to store');
    res.send('To jest sklep');
});

app.get('/userform', function(req, res) {
    var response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    }
    res.end(JSON.stringify(response));
});

app.post('/updateNote/:note', function(req, res) {

    fs.readFile('./test.json', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        stringifyFile = data;

        stringifyFile += req.params.note;

        fs.writeFile('./test.json', stringifyFile , function(err) {

            if (err) {
                throw err;
            }
            console.log('File updated');
            res.send(stringifyFile);
        });

    });
    //res.send('Identyfikator, który został dopisany to ' + req.params.note);
});

app.delete('/del_user', function(req, res) {
    console.log('Otrzymałem żądanie DELETE do strony /del_user');
    res.send('Hello DELETE!');
});

//app.listen(3000);


var server = app.listen(3000, 'localhost', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Przykładowa aplikacja nasłuchuje na http://' + host + ':' + port);
});

app.use(function(req,res,next) {
    res.status(404).send('Wybacz, nie mogliśmy odnaleźć tego, czego żądasz!');
});