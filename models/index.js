var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');
var data = require('./data');
var Schemas;

mongoose.connect(config.db, function(err){
	if(err){
		console.log('connect to %s error: ', config.db, err.message);
		process.exit(1);
	}
});

for(var m in data){
	Schemas = new Schema(data[m]);
	mongoose.model(m, Schemas);
}

exports.getModel = function(type){
	return mongoose.model(type);
};