var models = require('../models/index');

var Article = models.getModel('article');
var Author = models.getModel('author');
var Category = models.getModel('category');

var config = require('../config');
var tools = require('../common/tools');

var eventproxy = require('eventproxy');
var multiparty = require('multiparty');
var fs = require('fs');

var page = require('../common/page');

// 文章管理路由响应
exports.artList = function(req, res, next){

	var ep = new eventproxy();

	ep.all('getCate', 'getAuthor', 'getPageNum', 'popuArt', function(getCate, getAuthor, getPageNum, popuArt){
		res.render('admin/view_article', {
			config: config,
			categories: getCate,
			authors: getAuthor,
			articles: popuArt,
			allPage: parseInt(getPageNum),
			curNumPage: 1
		});
	});

	// 查找所有分类
	Category.find({}, '_id name', {sort: {name: 1}}, function(err, categories){
		ep.fail(err);
		ep.emit('getCate', categories);
	});
	// 查找所有作者
	Author.find({}, '_id name', {sort: {name: 1}}, function(err, authors){
		ep.fail(err);
		ep.emit('getAuthor', authors);
	});
	// 查找所有文章的数量 返回页数
	Article.find({}).count().exec(function(err, count){
		ep.fail(err);
		ep.emit('getPageNum', Math.ceil(count / config.page));
	});
	// 查询某页的默认数量的文章
	Article
	.find({})
	.sort({ createtime: -1 })
	.limit(config.page)
	.exec(function(err, articles){
		if (err) {
			return ep.emitLater('error', err);
		}
		ep.emitLater('getCurPageAtr', articles);
	});
	// 获取其他关联文档的数据
	ep.once('getCurPageAtr', function (articles) {
		var opts = [
			{ path: 'category', model: 'category', select: 'name' },
			{ path: 'author', model: 'author', select: 'name' }
		];
		Article.populate(articles, opts, function(err, doc){
			ep.fail(err);
			ep.emit('popuArt', doc);
		});
	});

};

exports.artPage = function(req, res, next){

	var num = req.query.cur;

	var ep = new eventproxy();

	ep.all('popuArt', function(popuArt){
		var data = {
			articles: popuArt
		};
		res.json(data);
	});

	// 查询某页的默认数量的文章
	Article
	.find({})
	.sort({ createtime: -1 })
	.skip((num - 1) * config.page)
	.limit(config.page)
	.exec(function(err, articles){
		if (err) {
			return ep.emitLater('error', err);
		}
		ep.emitLater('getCurPageAtr', articles);
	});
	// 获取其他关联文档的数据
	ep.once('getCurPageAtr', function (articles) {
		var opts = [
			{ path: 'category', model: 'category', select: 'name' },
			{ path: 'author', model: 'author', select: 'name' }
		];
		Article.populate(articles, opts, function(err, doc){
			ep.fail(err);
			ep.emit('popuArt', doc);
		});
	});

};

exports.artPublishLoad = function(req, res, next){

	var ep = new eventproxy();

	ep.all('getCate', 'getAuthor', function(getCate, getAuthor){
		res.render('admin/create_article', {
			config: config,
			authors: getAuthor,
			categories: getCate,
			article: null
		});
	});

	// 查找所有分类
	Category.find({}, '_id name', {sort: {name: 1}}, function(err, categories){
		ep.fail(err);
		ep.emit('getCate', categories);
	});
	// 查找所有作者
	Author.find({}, '_id name', {sort: {name: 1}}, function(err, authors){
		ep.fail(err);
		ep.emit('getAuthor', authors);
	});

};
exports.artPublish = function(req, res, next){

	var form = new multiparty.Form({
		uploadDir: './upload'
	});

	form.parse(req, function(err, fields, files){
		if(err) next(err);

		var rename;

		if(files[Object.keys(files)[0]][0].originalFilename == ''){
			fs.unlink(files[Object.keys(files)[0]][0].path);
			rename = '';

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

		if(fields.title.trim() == ''){
			res.render('admin/create_article', {
				error: 'error',
				msg: '标题不能为空！'
			});
		}else if(fields.abstract.trim() == ''){
			res.render('admin/create_article', {
				error: 'error',
				msg: '摘要不能为空！'
			});
		}else if(fields.content.trim() == ''){
			res.render('admin/create_article', {
				error: 'error',
				msg: '正文不能为空！'
			});
		}

		var reqData = fields;
		reqData.thumbnail = rename;

		var article = new Article(reqData);

		article.save(function(err, user, numAffected){

			Author.findByIdAndUpdate(article.author, {$inc: { docsum: 1}}, function(err, doc){
				if(err) next(err);
				if(numAffected){
					res.status(200).redirect('/' + config.entry + '/article/list');
				}

			});
		});

	});

};
exports.artAlterLoad = function(req, res, next){

	var _id = req.params.id;

	var ep = new eventproxy();

	ep.all('getCate', 'getAuthor', 'getArt', function(getCate, getAuthor, getArt){
		res.render('admin/create_article', {
			config: config,
			authors: getAuthor,
			categories: getCate,
			article: getArt
		});
	});

	// 查找所有分类
	Category.find({}, '_id name', {sort: {name: 1}}, function(err, categories){
		ep.fail(err);
		ep.emit('getCate', categories);
	});
	// 查找所有作者
	Author.find({}, '_id name', {sort: {name: 1}}, function(err, authors){
		ep.fail(err);
		ep.emit('getAuthor', authors);
	});
	// 根据id 查找文章
	Article.findById(_id, function(err, article){
		ep.fail(err);
		ep.emit('getArt', article);
	});
	
};
exports.artAlter = function(req, res, next){

	var _id = req.params.id;
	
	var form = new multiparty.Form({
		uploadDir: './upload'
	});

	form.parse(req, function(err, fields, files){
		if(err) next(err);

		var rename;

		if(files[Object.keys(files)[0]][0].originalFilename == ''){
			fs.unlink(files[Object.keys(files)[0]][0].path);

			rename = '';

			if(fields.alterThumbnail){
				rename = fields.alterThumbnail;
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

		if(fields.title.trim() == ''){
			res.render('admin/create_article', {
				error: 'error',
				msg: '标题不能为空！'
			});
		}else if(fields.abstract.trim() == ''){
			res.render('admin/create_article', {
				error: 'error',
				msg: '摘要不能为空！'
			});
		}else if(fields.content.trim() == ''){
			res.render('admin/create_article', {
				error: 'error',
				msg: '正文不能为空！'
			});
		}

		var reqData = fields;
		reqData.thumbnail = rename;

		Article.findByIdAndUpdate(_id, reqData, function(err){
			if(err) next(err);
			res.status(200).redirect('/' + config.entry + '/article/list');
		});

	});
};
exports.artRemove = function(req, res, next){
	var _id = req.body._id;
	Article.findByIdAndRemove(_id, function(err, article){
		if(err) next(err);

		article.thumbnail && fs.unlink('./' + article.thumbnail);
		res.send('删除成功！');
	});
};
exports.artSearch = function(req, res, next){
	
	var title = req.body.title,
		author = req.body.author,
		category = req.body.category,
		createtimeO = req.body.createtimeO,
		createtimeT = req.body.createtimeT;

	var condition = {};

	if(title != ''){
		condition.title = new RegExp(title);
	}
	if(author != '0'){
		condition.author = author;
	}
	if(category != '0'){
		condition.category = category;
	}
	if(createtimeO != ''){
		condition.createtime = condition.createtime || {};
		condition.createtime.$gt = tools.toDate(createtimeO);
	}
	if(createtimeT != ''){
		condition.createtime = condition.createtime || {};
		condition.createtime.$lt = tools.toDate(createtimeT);
	}

	var ep = new eventproxy();

	ep.all('getPageNum', 'tpl', function(getPageNum, tpl){

		var data = {
			articles: tpl,
			allPage: parseInt(getPageNum),
			curNumPage: 1
		};
		res.json(data);
	});

	Article.find(condition).count().exec(function(err, count){
		ep.fail(err);
		ep.emit('getPageNum', Math.ceil(count / config.page));
	});

	Article
	.find(condition, '_id title author category source createtime views')
	.sort({
		createtime: -1
	})
	.skip(0).limit(config.page).exec(function(err, articles){
		if (err) {
			return ep.emitLater('error', err);
		}
		ep.emitLater('getCurPageAtr', articles);
	});

	ep.once('getCurPageAtr', function (articles) {

		var opts = [
			{ path: 'category', model: 'category', select: 'name' },
			{ path: 'author', model: 'author', select: 'name' }
		];

		Article.populate(articles, opts, function(err, doc){
			ep.fail(err);
			ep.emit('tpl', doc);
		});

	});
	
};
exports.artSearchPage = function(req, res, next){

	var title = req.query.title,
		author = req.query.author,
		category = req.query.category,
		createtimeO = req.query.createtimeO,
		createtimeT = req.query.createtimeT,
		num = parseInt(req.query.cur);

	var condition = {};

	if(title != ''){
		condition.title = new RegExp(title);
	}
	if(author != '0'){
		condition.author = author;
	}
	if(category != '0'){
		condition.category = category;
	}
	if(createtimeO != ''){
		condition.createtime = condition.createtime || {};
		condition.createtime.$gt = tools.toDate(createtimeO);
	}
	if(createtimeT != ''){
		condition.createtime = condition.createtime || {};
		condition.createtime.$lt = tools.toDate(createtimeT);
	}

	var ep = new eventproxy();

	ep.all('tpl', function(tpl){
		var data = {
			articles: tpl,
			curNumPage: num
		};
		res.json(data);
	});

	Article
	.find(condition, '_id title author category source createtime views')
	.sort({
		createtime: -1
	})
	.skip((num - 1) * config.page).limit(config.page).exec(function(err, articles){
		if (err) {
			return ep.emitLater('error', err);
		}
		ep.emitLater('getCurPageAtr', articles);
	});

	ep.once('getCurPageAtr', function (articles) {
		var opts = [
			{ path: 'category', model: 'category', select: 'name' },
			{ path: 'author', model: 'author', select: 'name' }
		];

		Article.populate(articles, opts, function(err, doc){
			ep.fail(err);
			ep.emit('tpl', doc);
		});
	});

};