var config = require('../config');

var ensureLogined = function(req, res, next){

	if(!!req.session.logined){
		next();
	}else{
		if(req.url == '/login'){
			next();
		}else{
			res.redirect('/' + config.entry + '/login');
		}
	}

};
exports.ensureLogined = ensureLogined;