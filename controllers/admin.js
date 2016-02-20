function extend(o, p, override){
	for(var k in p){
		if(p.hasOwnProperty(k) && (!o.hasOwnProperty(k) || override)){
			o[k] = p[k];
		}
	}
}

var article = require('../controllers/article');
var author = require('../controllers/author');
var category = require('../controllers/category');
var master = require('../controllers/master');
var user = require('../controllers/user');
var log = require('../controllers/log');

var admin = {};

extend(admin, article);
extend(admin, author);
extend(admin, category);
extend(admin, master);
extend(admin, user);
extend(admin, log);

module.exports = admin;