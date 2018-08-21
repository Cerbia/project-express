var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var app = express();

var stringifyFile = '';

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(express.static('assets'));

app.get('/', function(req, res) {
    res.render('dynamic', {
        //user: { name: "Johnny", age: "20" },
        name: "Moja dynamiczna strona",
        url: "http://www.google.com"
    });
});

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

app.get('/auth/google', function(req, res) {
    res.render('first-template');
});



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


