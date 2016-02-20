var eventproxy = require('eventproxy');

var models = require('../models/index');

var Article = models.getModel('article');
var config = require('../config');

function right(cb){

	var ep = new eventproxy();

	ep.all('right', function(right){
		cb(right);
	});

	Article.find({}).sort({ views: -1 }).limit(8).exec(function(err, articles){
		ep.fail(err);
		ep.emit('right', articles);
	});
}

exports.load = right;