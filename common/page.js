var eventproxy = require('eventproxy');

var models = require('../models/index');

var Article = models.getModel('article');
var config = require('../config');

/** 分页
* artNumPage 每页的文章数
* curNumPage 当前页数 从 1 开始
*/
function paging(curNumPage, cb){

	if(typeof curNumPage == 'function'){
		cb = curNumPage;
		curNumPage = undefined;
	}

	var artNumPage = config.page,
		curNumPage = curNumPage || 1;

	var ep = new eventproxy();

	ep.all('getPageNum', 'getCurPageAtr', 'tpl', function(getPageNum, getCurPageAtr, tpl){
		cb({
			allPage: getPageNum,
			arts: tpl,
			curNumPage: curNumPage
		});
	});

	Article.find({}).count().exec(function(err, count){
		ep.fail(err);
		ep.emit('getPageNum', Math.ceil(count / artNumPage));
	});

	// 查询某页的默认数量的文章 
	Article.find({}).sort({ createtime: -1 }).skip((artNumPage * (curNumPage - 1))).limit(artNumPage).exec(function(err, articles){
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
			ep.emit('tpl', doc);
		});

	});

}

exports.load = paging;