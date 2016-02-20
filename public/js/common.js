(function(window){

	window.B = {
		// 简单的异步交互
		ajax: {
			createXHR: function(){
				var xhr = null;
				if(window.XMLHttpRequest){
					xhr = new XMLHttpRequest();
				}else{
					xhr = new ActiveXObject('Microsoft.XMLHTTP');
				}
				return xhr;
			},
			init: function(method, url, data, callback){

				if(typeof data == 'function'){
					callback = data;
					data = undefined;
				}

				var xhr = B.ajax.createXHR();
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4 && xhr.status == 200){
						callback(xhr);
					}
				};
				xhr.open(method, url, true);

				if(data){
					xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					xhr.send(data);
				}else{
					xhr.send(data);
				}	
			}
		},
		// 获取样式
		getCurStyle: function(obj, attribute){  
			return obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, false)[attribute];
		},
		// 添加事件监听
		bind: function(node, type, handler){
			node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
		},
		// 对象合并去重(向前合并)
		extend: function (o, p, override){
			for(var k in p){
				if(p.hasOwnProperty(k) && (!o.hasOwnProperty(k) || override)){
					o[k] = p[k];
				}
			}
		}

	};

})(window);