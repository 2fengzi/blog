var config = require('./config.js');

var path = require('path');
var Loader = require('loader'); // 静态资源加载器
var favicon = require('serve-favicon'); // 提高favicon的访问性能
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var ensure_logined = require('./common/ensure_logined');

var models = require('./models');

// 添加后台登录账号
if(config.user_autoCreate){
	console.log('System will Automatically add `User` of data.');
	var User = models.getModel('user');
	var user = new User(config.user);
	user.save(function(err, user, numAffected){
		if(err){
			throw err;
		}
		if(numAffected){
			fs.readFile('config.js', {encoding: 'utf8'}, function(err, data){
				data = data.replace('user_autoCreate: true', 'user_autoCreate: false');
				fs.writeFile('config.js', data, {encoding: 'utf8'}, function(err){
					if(err) throw err;
				});
			});
			console.log('System\'s account is created.');
			console.log(config.user.valueOf());
		}
	});
}

// 静态文件目录
var staticDir = path.join(__dirname, 'public');
// 上传图片目录
var uploadDir = path.join(__dirname, 'upload');

// assets
var assets = {};
if(config.mini_assets){
	try{
		assets = require('./assets.json');
	} catch (e) {
		console.log('You must execute `make build` before start app when mini_assets is true.');
		throw e;
	}
}

var app = express();

// 所有的环境配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); // 设置模板后缀
app.engine('html', require('ejs-mate'));

app.locals.Loader = Loader;
app.locals.assets = assets;
app.locals.dateFormat = require('./common/tools').dateFormat;

// 静态资源
app.use('/public', express.static(staticDir));
app.use('/upload', express.static(uploadDir));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(session({
	name: config.sessionId_name,
	secret: config.session_secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		path: '/' + config.entry,
		httpOnly: true,
		maxAge: config.session_maxAge,
		secure: false // 设为true时，只能通过https协议来访问该sessionId的cookie
	}
}));

// 前台路由
app.use('/', require('./routes'));
// 后台路由
app.use('/' + config.entry, ensure_logined.ensureLogined, require('./routes/admin'));

app.listen(config.port, function () {
  console.log("Blog listening on port %d", config.port);
});

module.exports = app;