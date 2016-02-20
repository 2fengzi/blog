var models = require('../models/index');

var User = models.getModel('user');

var config = require('../config');

var eventproxy = require('eventproxy');

// 登录系统路由响应
exports.loginLoad = function(req, res, next){
	res.render('admin/login', {
		config: config,
		error: {
			str: '',
			type: ''
		}
	});
};
exports.login = function(req, res, next){

	var account = req.body.account,
		password = req.body.password;

	if(account.trim() == ''){
		res.status(422);
		res.render('admin/login', {
			config: config,
			error: { 
				str: '账号不能为空！',
				type: 'account'
			}
		});
		return;
	}else if(password.trim()  == ''){
		res.status(422);
		res.render('admin/login', {
			config: config,
			error: { 
				str: '密码不能为空！',
				type: 'password'
			}
		});
		return;
	}
	User.findOne({account: account, password: password}, function(err, user){

		if(err){
			return next(err);
		}
		if(!user){
			res.render('admin/login', {
				config: config,
				error: { 
					str: '账号跟密码不相符！',
					type: 'account'
				}
			});
			return;
		}
		// session中保存的数据
		req.session.logined = true;
		req.session.user = user;

		res.redirect('/' + config.entry);
	});

};
exports.logout = function(req, res, next){
	if(req.session.logined){
		req.session.destroy(function(){
			res.redirect('/' + config.entry + '/login');
		});
	}else{
		next();
	}
};

// 欢迎页路由响应
exports.panel = function(req, res, next){
	res.render('admin/panel', {
		config: config,
		user: req.session.user
	});
};