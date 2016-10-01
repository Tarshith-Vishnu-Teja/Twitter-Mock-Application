/**
 * New node file
 */
var mysql = require('./mysql');
var ejs = require("ejs");
var username = "";


exports.validateCredentials = function(req, res){
	username = req.body.username;
	var password = req.body.password;
	console.log("Password is: " + password + " & Username is: " + username);
	var getUser = "select * from users where username = '" + username + "' and password = '" + password + "'";
    console.log("Query is:" + getUser);
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                console.log("valid Login");
                res.send({
            		"status" : "validLogin",
            		"statusCode" : "200"
            	});
            } else {
                console.log("Invalid Login");
                res.send({
            		"status" : "invalidLogin"
            	});
            }
        }
    }, getUser);
};

exports.signInSuccess = function(req, res){
	ejs.renderFile('./views/index.ejs', function(err, result){
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

exports.loadProfile = function(req, res){
    ejs.renderFile('./views/Profile.ejs', function(err, result){
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

exports.infoDOBUsername = function(req, res){
    var rowSizeOfFollowingTable = "";
    var getDOBUsername = "select firstName, date, month, year, joinedDate from test.users, test.birthday where users.username = '" + username + "' and users.username = birthday.username ";
    console.log("Query for DOBUsernameInfo is = " + getDOBUsername);
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                console.log("DOBUsernameInfo retreival from DB successfull");
                var rows = results;
                console.log("Results: " + (rows[0].joinedDate));
                var getTotalNumberOfPeopleThisUserIsFollowingQuery = "SELECT count(*) as numberOfFollowing from test.`" + username + "_following" + "`";
                mysql.run_aQuery(getTotalNumberOfPeopleThisUserIsFollowingQuery, function(err, following){
                    if (err)
                        throw err;
                    else{
                        rowSizeOfFollowingTable = following[0].numberOfFollowing;
                        console.log("rowSizeOfFollowingTable = " + rowSizeOfFollowingTable);
                        var getTotalNumberOfFollowersListQuery = "SELECT count(*) as numberOfFollowers from test.`" + username + "_followers" + "`";
                        mysql.run_aQuery(getTotalNumberOfFollowersListQuery, function(err, followers){
                            if (err)
                                throw err;
                            else{
                                var rowSizeOfFollowersTable = followers[0].numberOfFollowers;
                                res.send({
                                    "firstName" : rows[0].firstName,
                                    "date" : rows[0].date,
                                    "month" : rows[0].month,
                                    "year" : rows[0].year,
                                    "joinedDate" : rows[0].joinedDate,
                                    "rowSizeOfFollowingTable" : rowSizeOfFollowingTable,
                                    "rowSizeOfFollowersTable" : rowSizeOfFollowersTable
                                });
                            }
                        });
                    }
                });
            } else {
                console.log("Unsuccessfull at Retreiving DOBUsernameInfo");
            }
        }
    }, getDOBUsername);
}

exports.getAllUsernamesInDB = function(req, res){
    var getAllUsernamesInDB = "SELECT users.username, users.firstName, users.lastName FROM test.users LEFT JOIN test.`" + username + "_following" + "` ON users.username = `" + username + "_following" + "`.username WHERE (`" + username + "_following" + "`.username IS NULL) AND (users.username != '" + username + "') LIMIT 10";
    console.log("Query for getAllUsernamesInDB is  = " + getAllUsernamesInDB);
    mysql.run_aQuery(getAllUsernamesInDB, function(err,results){
        if(err){
            throw err;
        }
        else{
            if(results.length > 0){
                console.log("getAllUsernamesInDB retreival from DB Successfull");
                var rows = results;
                res.send({
                    "rows" : rows
                });
            }
        }
    }, getAllUsernamesInDB);
}

exports.tweetStoreInDB = function(req, res){
    var firstName = req.body.firstName;
    var tweetText = req.body.tweetText;
    var tweetStoreInDBQuery = "INSERT INTO `test`.`tweets` (`username`,`tweet`, `timeOfTweet`, `firstName`) VALUES ('" + username+ "', '" + tweetText + "', now(), '" + firstName + "')";
    mysql.run_aQuery(tweetStoreInDBQuery, function(err,result){
		if(err) 
		    throw err;
        else{
            if(result > 0){
                res.send({
                    "status" : "Success"
                });
            }
            else 
                res.send({
                    "status" : "Failed"
                });
        }
		console.log('Ran Query ID:', result);
  });
}

exports.retreiveTweetFromDB = function(req, res){
    var retreiveTweetFromDBQuery = "select `" + username + "_following" + "`.`username`, tweet, timeOfTweet, firstName from test.tweets, test.`" + username + "_following" + "` where tweets.username = `" + username + "_following" + "`.`username` union all select username, tweet, timeOfTweet, firstName from test.tweets where tweets.username = '" + username + "' order by timeOfTweet desc";
    console.log("retreiveTweetFromDBQuery = " + retreiveTweetFromDBQuery);  
    mysql.run_aQuery(retreiveTweetFromDBQuery, function(err,result2){
        if(err) 
            throw err;
        else {
            if (result2.length > 0) {
                var rows = result2;
                var jsonStringRows = JSON.stringify(rows);
                console.log("Results stringify type = " + jsonStringRows);
                console.log("\n\n****row len is = " + result2.length);
                console.log("unescape = " + unescape(rows));
                res.send({
                    "rows" : rows,
                    "rowSize" : result2.length,
                    "firstName" : rows.firstName
                });
            }
        }
    });  
}

exports.addUsernameToFollowing = function(req, res){
    var UsernameToFollow = req.body.UsernameToFollow;
    var addUsernameToFollowingQuery = "INSERT INTO `test`.`" + username + "_following" + "` (`username`) VALUES ('" + UsernameToFollow + "')";
    mysql.run_aQuery(addUsernameToFollowingQuery, function(err, result){
        if(err) 
            throw err;
        else {
        	console.log("reached inside result.length > 0");
            var getTotalNumberOfPeopleThisUserIsFollowingQuery = "show table status from test WHERE Name = '" + username + "_following" + "'";
            mysql.run_aQuery(getTotalNumberOfPeopleThisUserIsFollowingQuery, function(err, result1){
                if(err) 
                    throw err;
                else {
                    if (result1.length > 0){
                        console.log('rowSizeOfFollowingTable:', result1[0].Rows);
                        var rowSizeOfFollowingTable = Number(result1[0].Rows);
                        res.send({
                            "rowSizeOfFollowingTable" : rowSizeOfFollowingTable
                        })
                    }
                }
            });  
        }
    });
    var addUserToFollowersListQuery = "INSERT INTO `test`.`" + UsernameToFollow + "_followers" + "` (`username`) VALUES ('" + username + "')";
    mysql.run_aQuery(addUserToFollowersListQuery, function(err, result2){
        if(err) 
            throw err;
        else {
            console.log("user successfully added into followers list");
        }
    });
}

exports.getfollowing = function(req, res){
    var getfollowingTableQuery = "SELECT * from test.`" + username + "_following" + "`";
    mysql.run_aQuery(getfollowingTableQuery, function(err, userFollowingTable){
        if(err) 
            throw err;
        else {
            console.log("userFollowingTable successfully retrieved");
            res.send({
                "userFollowingTable" : userFollowingTable
            })
        }
    });
}

exports.getFollowers = function(req, res){
    var getFollowersTableQuery = "SELECT * from test.`" + username + "_followers" + "`";
    mysql.run_aQuery(getFollowersTableQuery, function(err, userFollowersTable){
        if(err) 
            throw err;
        else {
            console.log("userFollowersTable successfully retrieved");
            res.send({
                "userFollowersTable" : userFollowersTable
            })
        }
    });
}