var models = require('../models/index');

var User = models.getModel('user');

var config = require('../config');

var eventproxy = require('eventproxy');

// 后台管理员信息管理路由响应
exports.adminInfo = function(req, res, next){
	User.findOne({}, '_id account password', function(err, user){
		res.render('admin/user', {
			config: config,
			user: user
		});
	});
};
exports.adminSaveInfo = function(req, res, next){
	var a = req.body.account,
		p = req.body.password,
		_id = req.body._id;

	User.findByIdAndUpdate(_id, { account: a, password: p }, function(err){
		if(err) next(err);

		req.session.destroy(function(){
			res.send({status: 'success', url: '/' + config.entry + '/login'});
		});
	});
};