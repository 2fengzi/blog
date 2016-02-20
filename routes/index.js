var express = require('express');
var index = require('../controllers/index');

var router = express.Router();

router.get('/', index.list); // 加载首页

router.get('/page/:num', index.page); // 分页

router.get('/article/:id', index.detail); // 加载详情页

router.get('/about', index.about); // 加载about页面

router.get('/app', index.app); // 加载app下载页面

router.post('/search', index.search); // 搜索


module.exports = router;