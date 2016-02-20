var models = require('../models/index');

var Category = models.getModel('category');

var config = require('../config');
var tools = require('../common/tools');


var eventproxy = require('eventproxy');
var multiparty = require('multiparty');
var fs = require('fs');


// 分类管理路由响应
exports.cateList = function(req, res, next) {

	Category.find({}).sort({_id: 1}).exec(function(err, categories){

		if(err) next(err);

		res.render('admin/category', {
			config: config,
			categories: categories
		});

	});

};
exports.cateAdd = function(req, res, next){

	var categories = req.body.categories.trim();
	if(categories == ''){
		res.send({status: 'error', error: '标签不能是空字符串！'}).end();
	}
	categories = categories.split('-');

	var arr = [];

	for(var i = 0; i < categories.length; i++){
		arr.push({name: categories[i]});
	}

	Category.create(arr, function(err, categories){
		if(err) next(err);
		res.send({status: 'success', categories: categories});
	});

};
exports.cateRemove = function(req, res, next){
	var id = req.body._id;
	Category.findByIdAndRemove(id, function(err, category){
		if(err) next(err);
		res.send('success');
	});
};