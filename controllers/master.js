var models = require('../models/index');

var Master = models.getModel('master');

var config = require('../config');

var eventproxy = require('eventproxy');


// 站长信息管理路由响应
exports.masterInfo = function(req, res, next){

	Master.findOne({}, function(err, master){
		if(err) next(err);

		master = master == null ? {} : master;

		res.render('admin/master', {
			config: config,
			master: master
		});
	});
};
exports.masterSaveInfo = function(req, res, next){

	var data = {};

	for(var k in req.body){
		data[k] = req.body[k];
	}

	if(!data['_id']){

		delete data['_id'];

		var master = new Master(data);
		master.save(function(err){
			if(err) next(err);
			res.redirect('/' + config.entry + '/master/info');
		});
	}else{

		Master.findByIdAndUpdate(data['_id'], data, function(err){
			if(err) next(err);
			res.redirect('/' + config.entry + '/master/info');
		});
	}
};
