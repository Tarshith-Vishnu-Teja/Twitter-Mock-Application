/**
 * New node file
 */
var ejs = require('ejs'); //importing module ejs
var mysql = require('mysql'); //importing module mysql
function getConnection() {
    var connection = mysql.createConnection({
        host: 'localhost', //host where mysql server is running
        user: 'root', //user for the mysql application
        password: '2994', //password for the mysql application
        database: 'test', //database name
        port: 3306 //port, it is 3306 by default for mysql
    });
    return connection;
}
//fetching the data from the sql server
function fetchData(callback, sqlQuery) {
    console.log("\nSQL Query:" + sqlQuery);
    var connection = getConnection();
    connection.query(sqlQuery, function(err, rows, fields) {
        if (err) {
            console.log("ERROR: " + err.message);
        } else { // return err or result
            console.log("DB Results:" + rows);
            callback(err, rows);
        }
    });
    console.log("\nConnection closed..");
    connection.end();
}

exports.fetchData = fetchData;

exports.insertData = function(newSignUpEmail, newSignUpPassword, firstName, lastName, date, month, year, callback){
    console.log("\nSQL Query:" + newSignUpEmail + " " + newSignUpPassword);
    var connection = getConnection();
    sqlQuery = 'insert into users (firstName, lastName, username, password, joinedDate) values ("' + firstName + '", "' + lastName + '", "' + newSignUpEmail + '", "' + newSignUpPassword + '", now()) ';
    connection.query(sqlQuery, function(err, res) {
    	 if (err) throw err;
		    else {
		    	callback(err,res);
		    }
    });
    sqlQuery = 'insert into birthday (username, date, month, year) values ("' + newSignUpEmail + '", "' + date + '", "' + month + '", "' + year + '") ';
    connection.query(sqlQuery, function(err, res) {
    	 if (err) throw err;
    });
    console.log("\nConnection closed..");
    connection.end();
}

exports.run_aQuery = function(queryToRun, callback){
	var connection = getConnection();
	console.log("queryToRun = " + queryToRun);
	connection.query(queryToRun, function(err, res){
	 if (err) throw err;
	    else {
	    	callback(err,res);
	    }
	});
}