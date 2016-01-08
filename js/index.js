define('index',['require'],function(require) {

	var t = require('template');
	var reg = require('reglog');
	var p = require('publish');

	ele = {
		signObj:$('.sign-log li a').eq(0),
		logObj:$('.sign-log li a').eq(1),
		sunRise:$('.sunrise'),
		closeIco:$('.close-ico')
	};

	funList = {
		sunRise:function(obj,callback){
			$.each(obj,function(i,n){
				$(n).on('click',function(){
					ele.sunRise.addClass('sunny');
					var cName = $(this).attr('class');
					$('body').append( cName=='reg-btn' ? t.tpl.reg : t.tpl.log);
					setTimeout(function(){
						$('.box').addClass('trans')
						funList.sunSet(ele.closeIco);
					},100)
					reg.init();
					funList.sunSet(ele.sunRise);
					callback.call($('.close-ico'));
	 			});
			});
		},
		sunSet:function(obj){
			$(obj).on('click',function(){
				ele.sunRise.removeClass('sunny');
				$('.box').removeClass('trans');
				setTimeout(function(){
					$('.box').remove();
				},100)
			});
		},
	};

	rightFixed = function(){
		$('.container').bind('scroll',function(){
			if($(this).scrollTop()>=12){
				$('.n-right').addClass('right-fixed');
			}else if($(this).scrollTop()<12){
				$('.n-right').removeClass('right-fixed');
			}
		});
	};

	init = function(){
		funList.sunRise([ele.signObj,ele.logObj],function(){
			funList.sunSet(this);
		});

		rightFixed();
		
		if(location.href.indexOf('addPost')!= -1){
			p.init();
		}
	};

	return {
		init:init
	};
});




