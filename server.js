var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var app = express();

var stringifyFile = '';

app.use(bodyParser.json());

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

app.get('/', function(req, res) {
    console.log('Otrzymałem żądanie GET do strony głównej');
    res.send('Hello GET!');
});

app.post('/updateNote/:note', function(req, res) {

    stringifyFile += req.params.note;
    
    fs.writeFile('./test.json', stringifyFile , function(err) {

        if (err) {
            throw err;
        }
        console.log('File updated');
    });

    res.send('Identyfikator, który został dopisany to ' + req.params.note);
});

app.delete('/del_user', function(req, res) {
    console.log('Otrzymałem żądanie DELETE do strony /del_user');
    res.send('Hello DELETE!');
});

app.listen(3000);

app.use(function(req,res,next) {
    res.status(404).send('Wybacz, nie mogliśmy odnaleźć tego, czego żądasz!');
});