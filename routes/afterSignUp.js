/**
 * New node file
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var signUpEmail  = "";

exports.checkingDetails = function(req, res) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	signUpEmail = req.body.signUpEmail;
	var signUpPassword = req.body.signUpPassword;
    var date = req.body.date;
    var month = req.body.month;
    var year = req.body.year;
	console.log("First Name is: " + firstName + ", Last Name is: " + lastName + ", Email is: " + signUpEmail + " & Password is: " + signUpPassword);
	console.log("Date Of Birth is = " + date + "/" + month + "/" + year);
    var getUser = "select * from users where username = '" + signUpEmail + "' and password = '" + signUpPassword + "'";
	mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                console.log("Already Exists");
                res.send({
            		"status" : "alreadyExists",
            		"statusCode": "200"
            	});
            } else {
                console.log("New Entry");
                mysql.insertData(signUpEmail, signUpPassword, firstName, lastName, date, month, year, function(err,res){
          		  if(err) throw err;

          		  console.log('Last insert ID:', res);
          		});
                res.send({
            		"status" : "newEntry"
            	});
            }
        }
    }, getUser);
}

exports.createTablesForUser = function(req, res){
    var createFollowingTableForUserQuery = "CREATE TABLE `test`.`" + signUpEmail + "_following" + "` (`username` VARCHAR(45) NOT NULL, PRIMARY KEY (`username`))";
    console.log("createFollowingTableForUserQuery" + createFollowingTableForUserQuery);
    mysql.run_aQuery(createFollowingTableForUserQuery, function(err, res){
        if(err) throw err;
        console.log('Ran Query ID:', res);
    });
    
    var createFollowingTableForUserQuery = "CREATE TABLE `test`.`" + signUpEmail + "_followers" + "` (`username` VARCHAR(45) NOT NULL, PRIMARY KEY (`username`))";
    console.log("createFollowingTableForUserQuery" + createFollowingTableForUserQuery);
    mysql.run_aQuery(createFollowingTableForUserQuery, function(err, res){
        if(err) throw err;
        console.log('Ran Query ID:', res);
    });
}

exports.signUpSuccess = function(req, res){
	ejs.renderFile('./views/signIn.ejs', function(err, result){
		// render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
	});	
}