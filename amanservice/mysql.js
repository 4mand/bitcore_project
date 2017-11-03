var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bitcore_project"
});

var getAddressMatch = function(address, callback){
	con.connect(function(err) {
	  if (err) throw err;
	  con.query("SELECT id FROM adress where id = '${address}'", function (err, result, fields) {
	    if (err) return callback(err,null);

	    var res = result ? result[0].id : "";
	    return callback(null,res);
	  });
	});
}

var mysqlService = {
	getAddressMatch : getAddressMatch
}

module.exports = mysqlService;