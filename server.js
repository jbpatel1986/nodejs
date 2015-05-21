var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit :10,
    host            :'localhost',
    user            :'root',
    password        :'',
    database        :'jigs'
});

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.route('/profile')
    .get(function(req, res) {
        console.log('About to retrieve the data');

        pool.getConnection(function(err, connection){
            if(err) throw err;
            connection.query('SELECT * FROM test', function(err, rows, fields){
                if(err) throw err;
                res.send(rows);
                connection.release();
            });
        });
    })
    .post(function(req, res) {
        console.log('About to create the data');
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var age = req.body.age;

        if(typeof firstName === 'undefined'){
            throw new Error("First Name is undefined");
        }

        if(typeof lastName === 'undefined'){
            throw new Error("Last Name is undefined");
        }

        if(typeof age === 'undefined'){
            throw new Error("Age is undefined");
        }

        pool.getConnection(function(err, connection){
            if(err) throw err;
            connection.query("INSERT INTO test (first_name, last_name, age) VALUES ('" + firstName + "', '" + lastName + "', '" + age + "')", function(err, rows, fields){
                if(err) throw err;
                res.send(rows);
                connection.release();
            });
        });
    });

router.route('/profile/:id')
    .get(function(req, res){
        var id = req.params.id;
        console.log('About to get the data with selected id: ' + id);

        pool.getConnection(function(err, connection){
            if(err) throw err;
            connection.query("SELECT * FROM test WHERE id=" + id, function(err, rows, fields){
                res.send(rows);
                connection.release();
            });
        });
    })
    .put(function(req,res){
        var id = req.params.id;
        console.log('About to update the data with selected id: ' + id);
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var age = req.body.age;

        if(typeof firstName === 'undefined'){
            throw new Error("First Name is undefined");
        }

        if(typeof lastName === 'undefined'){
            throw new Error("Last Name is undefined");
        }

        if(typeof age === 'undefined'){
            throw new Error("Age is undefined");
        }

        pool.getConnection(function(err, connection){
            connection.query("UPDATE test SET first_name = '" + firstName + "', last_name = '" + lastName + "', age = '" + age + "' WHERE id =" + id, function(err, rows, fields){
                res.send(rows);
                connection.release();
            });
        });
    })
    .delete(function(req, res){
        var id = req.params.id;
        console.log('About to delete the data with selected id: ' + id);

        pool.getConnection(function(err, connection){
            connection.query("DELETE FROM test WHERE id =" + id, function(err, rows, fileds){
                res.send(rows);
                connection.release();
            });
        });
    });

app.use('/api', router);
app.listen(8080);
