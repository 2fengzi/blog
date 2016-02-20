(function(win){

	win.page = {

		entry: '',
		// 默认值
		opts: {
			box: document.querySelector('.page-box'),
			cur: 1,
			pageLen: 5,
			url: '',
			pages: 1,
			cb: function(){} // 点击分页按钮后的回调
		},
		init: function(options){

			this.entry = document.querySelector('input[name="entry"]').value;
			this.opts.url = '/'+ this.entry +'/article/list/';

			options = options ? options : {};

			B.extend(this.opts, options, true);

			if(this.opts.pages <= 1){
				this.opts.box.style.display = 'none';
			}

			this.opts.box.innerHTML = '';

			this.create(this.opts.box, this.opts.cur, this.opts.pageLen, this.opts.pages);
			this.bind(this.opts.cb);
		},
		// b -> box  c -> cur  pl -> pageLen  ps -> pages
		create: function(b, c, pl, ps){

			if(ps <= pl){
				for(var i = 1; i <= ps; i++){
					var item = document.createElement('a');
					item.href = this.opts.url + '#' + i;
					item.text = i;
					if(c == i){
			 			item.setAttribute('class', 'active');
			 		}
					b.appendChild(item);
				}

			}else{
				for(var i = 1; i <= pl; i++){
				 	var item =document.createElement('a');
				 	item.href = this.opts.url + '#' + (c - 3 + i);
				 	if(c <= 2){
				 		item.href = this.opts.url + '#' + i;
				 		item.text = i;
				 		if(c == i){
				 			item.setAttribute('class', 'active');
				 		}
				 	}else if(c >= ps - 2){
				 		item.href = this.opts.url + '#' + (ps - pl + i);
				 		item.text = (ps - pl + i);
				 		if(c == (ps - pl) + i){
				 			item.setAttribute('class', 'active');
				 		}
				 	}else{
			 			item.text = c - 3 + i;
			 			if(i == 3){
			 				item.setAttribute('class', 'active');
			 			}
				 	}
				 	b.appendChild(item);
				}
			}

			if(c <= ps - 3 && ps >= pl + 1){
				var ellipsis = document.createElement('a');
				ellipsis.removeAttribute('href');
				ellipsis.text = '...';

				var allPage = document.createElement('a');
				allPage.href = this.opts.url + '#' + ps;
				allPage.text = ps;

				b.appendChild(ellipsis);
				b.appendChild(allPage);
			}
		},
		bind: function(cb){

			var _this = this;

			var itemClick = function(e){

				if(e.target.getAttribute('href') != null){
					cb(e.target);

					e.target.parentNode.querySelector('.active').className = '';
					e.target.className = 'active';

					e.preventDefault(); // 阻止a标签的默认行为
				}
			};
			_this.opts.box.removeEventListener('click', itemClick, false);
			_this.opts.box.addEventListener('click', itemClick, false);
		}

	};

})(window);