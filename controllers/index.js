var eventproxy = require('eventproxy');

var models = require('../models/index');

var Article = models.getModel('article');
var Category = models.getModel('category');
var Author = models.getModel('author');
var config = require('../config');

var page = require('../common/page');
var right = require('../common/right');


exports.list = function(req, res, next){

	var ep = new eventproxy();

	ep.all('right', 'tpl', function(right, tpl){
		res.render('index', {
			config: config,
			articles: tpl.arts,
			allPage: parseInt(tpl.allPage),
			curNumPage: parseInt(tpl.curNumPage),
			artRights: right
		});
	});

	right.load(function(artRight){
		ep.emit('right', artRight);
	});

	page.load(function(page){
		ep.emitLater('page', page);
	});

	ep.once('page', function(page){
		ep.emit('tpl', page);
	});
	
};

exports.page = function(req, res, next){

	var num = req.params.num;

	var ep = new eventproxy();

	ep.all('right', 'tpl', function(right, tpl){
		res.render('index', {
			config: config,
			articles: tpl.arts,
			allPage: parseInt(tpl.allPage),
			curNumPage: parseInt(tpl.curNumPage),
			artRights: right
		});
	});

	right.load(function(artRight){
		ep.emit('right', artRight);
	});

	page.load(num, function(page){
		ep.emitLater('page', page);
	});

	ep.once('page', function(page){
		ep.emit('tpl', page);
	});

};

exports.detail = function(req, res, next){

	var _id = req.params.id;

	var ep = new eventproxy();
	var opts = [
			{ path: 'author', model: 'author', select: 'name' },
			{ path: 'category', model: 'category', select: 'name'}
		];

	ep.all('find', 'rela', 'author', 'prev', 'next', 'right', function(find, rela, author, prev, next, right){
		res.render('details', {
			config: config,
			article: rela,
			author: author,
			prevArt: prev,
			nextArt: next,
			artRights: right
		});
	});

	Article.findByIdAndUpdate(_id, {$inc: {views: 1}}, function(err, article){
		ep.fail(err);
		ep.emitLater('find', article);
	});

	ep.once('find', function(article){
		Article.populate(article, opts, function(err, article){
			ep.fail(err);
			ep.emitLater('rela', article);
		});
		Article.findOne({}).where('createtime').gt(article.createtime).sort({ createtime: 1 }).exec(function(err, prevArt){
			ep.fail(err);
			ep.emit('prev', prevArt);
		});
		Article.findOne({}).where('createtime').lt(article.createtime).sort({ createtime: -1 }).exec(function(err, nextArt){
			ep.fail(err);
			ep.emit('next', nextArt);
		});
	});

	ep.once('rela', function(article){
		var author_id = article.author._id;
		Author.findById(author_id, function(err, author){
			ep.fail(err);
			ep.emit('author', author);
		});
	});
	right.load(function(artRight){
		ep.emit('right', artRight);
	});

};

exports.about = function(req, res, next){
	right.load(function(artRight){
		res.render('about', {
			config: config,
			artRights: artRight
		});
	});
};

exports.app = function(req, res, next){
	res.render('app', {
		config: config
	});
};

exports.search = function(req, res, next){
	
	var condition = req.body.condition;

	var ep = new eventproxy();
	var result = [];
	var opts = [
			{ path: 'author', model: 'author', select: 'name' },
			{ path: 'category', model: 'category', select: 'name'}
		];


	ep.all('right', 'search', function(right, search){

		res.render('result', {
			config: config,
			articles: search,
			key: condition,
			artRights: right
		});

	});

	right.load(function(artRight){
		ep.emit('right', artRight);
	});


	Article.find({}, function(err, docs){
		docs.forEach(function(art){
			if(art.title.match(condition)){
				result.push(art);
			}
		});
		ep.emit('search', result);
	});

};