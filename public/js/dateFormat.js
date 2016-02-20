var dateFormat = function(date, format){

	var o = {
		'y+' : date.getFullYear(), // 年份 2015
		'm+' : date.getMonth() + 1, // 月份 10
		'd+' : date.getDate(), // 月份中的一天 3
		'h+' : date.getHours(), // 小时 10
		'M+' : date.getMinutes(),  // 分钟 0
		's+' : date.getSeconds()	// 秒 32
	};

	function week(num){
		var week = '';
		switch(num){
			case 0: 
				week = '星期日';
				break;
			case 1:
				week = '星期一';
				break;
			case 2:
				week = '星期二';
				break;
			case 3: 
				week = '星期三';
				break;
			case 4:
				week = '星期四';
				break;
			case 5:
				week = '星期五';
				break;
			case 6: 
				week = '星期六';
				break;
			default: 
				break;
		}
		return week;
	}

	format = format ? format : 'yyyy-mm-dd hh:MM:ss';

	for(var k in o){
		if (new RegExp("(" + k + ")").test(format)){
			format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((RegExp.$1.length == 4) ? (o[k]) : ('00' + o[k]).substr((o[k]).toString().length)));
		}
	}

	if(/(e+)/.test(format)){
		format = format.replace(RegExp.$1, week(date.getDay()));
	}

	return format;
};