var config = {

	// 网站名称
	name: '前端笔记',
	// 网站关键字
	keywords: '前端, web开发, nodejs, mongodb',
	// 网站描述
	description: '分享开发经验，共同探索新技术',
	// 网站作者
	author: 'xiaohui',
	// github地址
	github: 'https://github.com/2fengzi/blog',

	// mongodb 配置
	db: 'mongodb://127.0.0.1/blog',
	db_name: 'blog',

	// 后台入口
	entry: 'serve',
	// 程序运行的端口号
	port: '80',
	// 自动创建后台账号
	user_autoCreate: true,
	// 后台登录账号，密码
	user: {
		account: 'admin',
		password: '123456'	
	},
	// cookie加密
	session_secret: 'xiaohui',
	// 登录session在客户端的cookie名称
	sessionId_name: 'huidee',
	// session在客户端的cookie生命期 单位为ms
	session_maxAge: 1000 * 60 * 60 * 24 * 7, // 7天  设为null，则关闭浏览器session便不生效
	// 静态文件存储域名
	site_static_host: '',
	// 是否启动静态资源的压缩，合并
	mini_assets: false,

	// 域名备案号
	icp: '京ICP备15040936号',

	// 默认图片
	default_img: '/public/img/default.jpg',
	// 分页--每页文章数
	page: 10

};
module.exports = config;