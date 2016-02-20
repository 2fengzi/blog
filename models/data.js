var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	sourceArr = ['原创', '转载']; 

module.exports = {

	// 文章
	article: {

		title: { type: String, required: true, index: 1 },
		abstract: { type: String, required: true }, // 摘要
		content: { type: String, required: true },
		author: { type: ObjectId, ref: 'authors', index: 1 },
		thumbnail: { type: String },
		category: { type: ObjectId, ref: 'categorys', index: 1, required: true },
		views: { type: Number, default: 0 }, // 阅读数量
		source: { type: String, enum: sourceArr, required: true },
		sourcepath: { type: String },
		createtime: { type: Date, default: Date.now, index: 1 }

	},
	// 分类
	category: {

		name: { type: String, required: true, index: 1 }

	},
	// 作者
	author: {

		name: { type: String, required: true, index: { unique: true, sparse: true } },
		photo: { type: String, default: '' },
		motto: { type: String },
		email: { type: String, required: true },
		address: { type: String },
		phone: { type: String },
		website: { type: String },
		docsum: { type: Number, default: 0 }

	},
	// 站长信息
	master: {

		name: { type: String, required: true },
		sex: { type: String, enum: ['男', '女'] },
		phone: { type: String },
		email: { type: String, required: true },
		website: { type: String },
		hobby: { type: String },
		experience: { type: String },
		other: { type: String }

	},
	// 后台管理
	user: {

		account: { type: String, required: true, unique: true},
		password: { type: String, required: true },
		createtime: { type: Date, default: Date.now }

	}

};