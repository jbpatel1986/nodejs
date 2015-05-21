var mysql = require('mysql');

var connection = mysql.createConnection({
    host:       'localhost',
    user:       'root',
    password:   '',
    database:   'jigs'
});



var express = require('express');
var app = express();

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.get('/profile', function(req, res, next) {
    console.log('About to retrieve the data');
    connection.connect();

    connection.query('select * from test', function(err, rows, fields){
        if(err) throw err;
        res.send(rows);
    });
    connection.end();
});

router.route('/profile')
    .post(function(req, res, next) {
        console.log('About to create the data');
        connection.connect();

        connection.query("INSERT INTO 'jigs'.'test' ('name') VALUES ('J Patel')", function(err, rows, fields){
            if(err) throw err;
            res.send(rows);
        });

        connection.end();
        next();
    }).get(function(req, res) {
        console.log('About to retrieve the data');
        connection.connect();

        connection.query('select * from test', function(err, rows, fields){
            if(err) throw err;
            res.send(rows);
        });
        connection.end();
        next();
    });

app.use('/api', router);
app.listen(3000);
