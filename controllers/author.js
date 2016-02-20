var models = require('../models/index');

var Author = models.getModel('author');

var config = require('../config');
var tools = require('../common/tools');

var eventproxy = require('eventproxy');
var multiparty = require('multiparty');
var fs = require('fs');


// 作者信息管理路由响应
exports.authorList = function(req, res, next){

	Author.find({}).sort({_id: 1}).limit(10).exec(function(err, author){

		if(err) next(err);

		res.render('admin/view_author', {
			config: config,
			authors: author
		});

	});

};
exports.authorPublishLoad = function(req, res, next){
	res.render('admin/create_author', {
		config: config,
		author: null
	});
};
exports.authorPublish = function(req, res, next){
		
	var form = new multiparty.Form({
		uploadDir: './upload'
	});

	form.parse(req, function(err, fields, files){
		if(err) next(err);

		var rename;

		if(files[Object.keys(files)[0]][0].originalFilename == ''){
			fs.unlink(files[Object.keys(files)[0]][0].path);
			rename = config.default_img;

		}else{

			// 上传图片的命名规则  photo20151022.png
			rename = Object.keys(files)[0] + Date.parse(new Date()) + '.' + files[Object.keys(files)[0]][0].path.split('.')[1];

			fs.rename('./' + files[Object.keys(files)[0]][0].path, './upload/' + rename, function(err){
				if(err) next(err);
			});

			rename = '/upload/' + rename;
		}

		for(var field in fields){
			fields[field] = fields[field].toString();
		}

		if(fields.motto == ''){
			fields.motto = '这个家伙有点懒，神马都没有....';
		}else if(fields.name == ''){
			res.render('admin/create_author', {
				error: 'error',
				msg: '作者名称不能为空！'
			});
		}else if(fields.phone == ''){
			res.render('admin/create_author', {
				error: 'error',
				msg: '联系电话不能为空！'
			});
		}else if(fields.email == ''){
			res.render('admin/create_author', {
				error: 'error',
				msg: '邮箱不能为空！'
			});
		}

		// Author.find({name: fields.name}, function(err, author){

		// 	if(err) next(err);
		// 	if(!author.length){
		// 		res.render('admin/create_author', {
		// 			error: 'error',
		// 			msg: '作者名称已经存在！'
		// 		});
		// 	}
		// });

		var reqData = fields;
		reqData.photo = rename;

		var author = new Author(reqData);

		author.save(function(err, user, numAffected){
			if(err) next(err);
			if(numAffected){
				res.status(200).redirect('/' + config.entry + '/author/list');
			}
		});

	});

};
exports.authorAlterLoad = function(req, res, next){

	var _id = req.params.id;

	Author.findById(_id, function(err, author){

		if(err) next(err);

		res.render('admin/create_author', {
			config: config,
			author: author
		});

	});

};
exports.authorAlter = function(req, res, next){

	var _id = req.params.id;
	
	var form = new multiparty.Form({
		uploadDir: './upload'
	});

	form.parse(req, function(err, fields, files){
		if(err) next(err);

		var rename;

		if(files[Object.keys(files)[0]][0].originalFilename == ''){
			fs.unlink(files[Object.keys(files)[0]][0].path);

			rename = config.default_img;

			if(fields.alterPhoto){
				rename = fields.alterPhoto;
			}

		}else{

			// 上传图片的命名规则  photo20151022.png
			rename = Object.keys(files)[0] + Date.parse(new Date()) + '.' + files[Object.keys(files)[0]][0].path.split('.')[1];

			fs.rename('./' + files[Object.keys(files)[0]][0].path, './upload/' + rename, function(err){
				if(err) next(err);
			});

			rename = '/upload/' + rename;
		}

		for(var field in fields){
			fields[field] = fields[field].toString();
		}

		if(fields.motto == ''){
			fields.motto = '这个家伙有点懒，神马都没有....';
		}else if(fields.name == ''){
			res.render('admin/create_author', {
				error: 'error',
				msg: '作者名称不能为空！'
			});
		}else if(fields.phone == ''){
			res.render('admin/create_author', {
				error: 'error',
				msg: '联系电话不能为空！'
			});
		}else if(fields.email == ''){
			res.render('admin/create_author', {
				error: 'error',
				msg: '邮箱不能为空！'
			});
		}

		// Author.find({name: fields.name}, function(err, author){

		// 	if(err) next(err);
		// 	if(!author.length){
		// 		res.render('admin/create_author', {
		// 			error: 'error',
		// 			msg: '作者名称已经存在！'
		// 		});
		// 	}
		// });

		var reqData = fields;
		reqData.photo = rename;

		Author.findByIdAndUpdate(_id, reqData, function(err){
			if(err) next(err);
			res.status(200).redirect('/' + config.entry + '/author/list');
		});

	});

};
exports.authorRemove = function(req, res, next){
	var _id = req.body._id;
	Author.findByIdAndRemove(_id, function(err, author){
		if(err) next(err);

		fs.unlink('./' + author.photo);
		res.send('删除成功！');
	});
};