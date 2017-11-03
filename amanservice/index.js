var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var bitcore = require('bitcore-lib');
var Transaction = bitcore.Transaction;
var Block = bitcore.Block;
var mysqlService = require('./mysql');


var AmanService = function(options) {
  console.log("Service started");
  EventEmitter.call(this);

  this.node = options.node;
  this.name = options.name;
}
inherits(AmanService, EventEmitter);

AmanService.dependencies = ['bitcoind', 'web'];

AmanService.prototype.start = function(callback) {

	this.node.services.bitcoind.on('tx', function(transactionBuffer) {
	// a new transaction has entered the mempool
		var tx = new Transaction().fromBuffer(transactionBuffer);
		this.node.getDetailedTransaction(tx.hash, function(err, transaction) {
	        if (err){
	          console.log("Error",err);
	        }
	        if(transaction && transaction.hash && transaction.blockHash){
		  		console.log("New transaction ----> Hash ", transaction.hash, " blockHash ", transaction.blockHash);
		  		var outputAddress = transaction.outputs[0].address;
		  		var matchInDb = mysqlService.getAddressMatch(outputAddress, function(err, res){
			  		if( outputAddress === matchInDb){
			  			console.log("match found in addresses stored");
			  			var addressBalance = this.node.services.bitcoind.getAddressBalance(outputAddress);
			  			console.log("The balance in address ", outputAddress, " is ", addressBalance);
			  		}
		  		}); 
		  	}else{
		  		console.log("Bad transaction ---->", transaction);
		  	}
		});
	});

	this.node.services.bitcoind.on('block', function(blockHash) {
		console.log("New BLOCK ---->");
		var block = new Block(blockHash)
		//var blockHex = blockHash.toString('hex');
		console.log("New BLOCK ---->", block);
	});
	
	setImmediate(callback);
};

AmanService.prototype.stop = function(callback) {
  setImmediate(callback);
};

AmanService.prototype.getAPIMethods = function() {
  return [];
};

AmanService.prototype.getPublishEvents = function() {
  return [];
};

module.exports = AmanService;