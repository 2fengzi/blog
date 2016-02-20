var express = require('express');
var admin = require('../controllers/admin');

var config = require('../config');

var router = express.Router();

// 登录系统路由
router.get('/login', admin.loginLoad);
router.post('/login', admin.login);
router.get('/logout', admin.logout);

// 欢迎页路由
router.get('/', admin.panel); // 加载欢迎页

// 文章管理路由
router.get('/article/list', admin.artList); // 加载文章管理页
router.get('/article/publish', admin.artPublishLoad); // 加载文章发布页
router.post('/article/publish', admin.artPublish); // 发布内容保存到数据库
router.get('/article/alter/:id', admin.artAlterLoad); // 加载文章修改页
router.post('/article/alter/:id', admin.artAlter); // 修改内容保存到数据库
router.post('/article/remove', admin.artRemove); // 文章删除
router.get('/article/list/page', admin.artPage); // 分页
router.post('/article/search', admin.artSearch); // 文章搜索
router.get('/article/search/list/page', admin.artSearchPage); // 搜索分页

// 分类管理路由
router.get('/category/list', admin.cateList); // 加载分类管理页
router.post('/category/add', admin.cateAdd); // 添加分类的处理
router.post('/category/remove', admin.cateRemove); // 分类删除

// 作者信息路由
router.get('/author/list', admin.authorList); // 加载作者列表
router.get('/author/publish', admin.authorPublishLoad); // 加载作者添加页
router.post('/author/publish', admin.authorPublish); // 添加内容保存到数据库
router.get('/author/alter/:id', admin.authorAlterLoad); // 加载作者修改页
router.post('/author/alter/:id', admin.authorAlter); // 修改内容保存到数据库
router.post('/author/remove', admin.authorRemove); // 作者删除

// 站长信息路由
router.get('/master/info', admin.masterInfo); // 加载站长信息页面
router.post('/master/info', admin.masterSaveInfo); // 站长信息的处理

// 后台管理员账号管理路由
router.get('/user/info', admin.adminInfo); // 加载管理员信息页面
router.post('/user/info', admin.adminSaveInfo); // 管理员信息的处理

module.exports = router;