// 设置图片显示位置、大小 
var resize = function(sizeJson,objImg){
	var img = new Image();
	img.src = objImg.src;
	var hRatio;
	var wRatio;
	var Ratio = 1;
	var w = objImg.width;
	var h = objImg.height;
	var margin ='';
	wRatio = sizeJson.w / w;  // 获取宽的比例
	hRatio = sizeJson.h / h;   // 获取高的比例
	Ratio = wRatio >= hRatio ? wRatio : hRatio;
	w = parseInt(w * Ratio);
	h = parseInt(h * Ratio);

	if(w == sizeJson.w && h != sizeJson.h){
		margin = (-(h - sizeJson.h) / 2) + 'px 0 0 0';
	}else if(h == sizeJson.h && w != sizeJson.w){
		margin = '0 0 0 ' + (-(w - sizeJson.w) / 2) + 'px';
	}else if(w == sizeJson.w && h == sizeJson.h){
		margin='0 0 0 0';
	}
	return { w:w, h:h, src:img.src, m:margin };
};

var changeImg = function(o){

	var pw = parseInt(B.getCurStyle(o.parentNode, 'width')),
		ph = parseInt(B.getCurStyle(o.parentNode, 'height'));

	var rect = resize({w: pw, h: ph}, o);

	o.width = rect.w;
	o.height = rect.h;
	o.style.margin = rect.m;
};