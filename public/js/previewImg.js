function previewImage(file){

	var previewBox = document.querySelector('.preview-box');
	var MAXWIDTH  = parseInt(B.getCurStyle(previewBox, 'width'));
	var MAXHEIGHT = parseInt(B.getCurStyle(previewBox, 'height'));

	if (file.files && file.files[0]){

		previewBox.innerHTML = '<img class="preview">';
		var img = document.querySelector('.preview');

		var reader = new FileReader();
		reader.onload = function(evt){
			img.src = evt.target.result;

			var result = resize({w: MAXWIDTH, h: MAXHEIGHT}, img);

			img.width = result.w;
			img.height = result.h;
			img.style.margin = result.m;

		}
		reader.readAsDataURL(file.files[0]);

	}else{

		var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
		file.select();
		var src = document.selection.createRange().text;
		previewBox.innerHTML = '<img class="preview">';
		var img = document.querySelector('.preview');
		img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;

		var rect = resize({w: MAXWIDTH, h: MAXHEIGHT}, img);

		previewBox.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin:"+rect.m + "px;" + sFilter + src + "\"'></div>";
	}
}