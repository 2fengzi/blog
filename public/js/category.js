var category = {

	entry: document.querySelector('input[name="entry"]').value,

	init: function(){
		// 已有标签随机生成颜色
		var categories = document.querySelector('.categories-box').getElementsByTagName('li');

		for(var i = 0; i < categories.length; i++){
			var color = '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);

			if(categories.length <= 1 && (/noData/.test(categories[0].className))){
				continue;
			}
			categories[i].style.backgroundColor = color;
			categories[i].getElementsByTagName('i')[0].style.backgroundColor = color;
		}

		// 添加 点击 添加标签按钮 的事件监听
		B.bind(document.querySelector('.js-addCategory'), 'click', category.addCate);

		// 添加 点击 删除标签按钮 的事件监听
		B.bind(document.querySelector('.categories-box'), 'click', category.removeCate);

	},
	addCate: function(e){

		var _this = e.target,
			categories = _this.parentNode.querySelector('input[type="text"]').value.trim();

		if(categories == ''){
			alert('标签不能是空字符串！');
			return false;
		}

		B.ajax.init('post', '/' + category.entry + '/category/add', 'categories=' + categories, function(o){
		
			var data = JSON.parse(o.responseText);

			if(data.status == 'success'){

				_this.parentNode.querySelector('input[type="text"]').value = '';

				for(var i = 0; i < data.categories.length; i++){
					var color = '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
					var oli = document.createElement('li');
					var oi = document.createElement('i');
					oli.style.backgroundColor = color;
					oi.style.backgroundColor = color;
					oi.innerHTML = '✕';
					oi.setAttribute('data-id', data.categories[i]._id);
					oli.innerHTML = data.categories[i].name;
					oli.appendChild(oi);
					document.querySelector('.categories-box').getElementsByTagName('ul')[0].appendChild(oli);
				}
				alert('添加成功！');
			}
			if(data.status == 'error'){
				alert(data.error);
			}
		});

	},
	removeCate: function(e){

		if(!!e.target.getAttribute('data-id')){
			var id = e.target.getAttribute('data-id');
			var data = '_id=' + id;

			if(confirm('确定要删除该标签吗？')){
				B.ajax.init('post', '/' + category.entry + '/category/remove', data, function(o){
					if(o.responseText == 'success'){
						alert('删除成功！');
						window.location.href = '';
					}
				});
			}
		}
	}

};