var validateErr = {

	init: function(o, s){

		var html = '<div class="validate-tips">';
			html += '<a class="tips-close" href="javascript: void(0);">✕</a>';
			html += '<p class="tips-msg icon-warning">';
			html += s;
			html += '</p>';
			html += '<span class="poptip-arrow poptip-arrow-bottom"><em>◆</em><i>◆</i></span>';
			html += '</div>';

		if($('.validate-tips').size() > 0){
			$('.tips-msg').text(s);
			$('.validate-tips').show();
		}else{
			$('body').append(html);
		}

		var w = $(o).outerWidth(),
			h = $('.validate-tips').outerHeight(),
			t = $(o).offset().top,
			l = $(o).offset().left;

		$('.validate-tips').css({
			width: w - 25,
			left: l,
			top: t - h - 6
		});

		$(document).on('click', '.tips-close', function(){
			validateErr.close();
		});

		return this;
	},
	close: function(){
		$('.validate-tips').hide();
	}
};

$(function(){
	var err = $('#err').val();
	if(err == ''){
		return false;
	}
	validateErr.init($('[name="'+ $('#err').data('type') +'"]'), err);
});