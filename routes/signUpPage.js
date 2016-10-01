/**
 * New node file
 */
var ejs = require("ejs");
exports.signUp = function (req, res){
	ejs.renderFile('./views/signUp.ejs', function(err, result){
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