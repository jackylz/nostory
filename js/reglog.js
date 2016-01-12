define('reglog',function(require){
	
	var t = require('template');
	var md5 = require('md5');

	val = {
		email:null,
		apass:null,
		bpass:null,
		vpass:null
	};

	regex = {
		email:/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+.)+([a-zA-Z]{2,4})+$/,
		pass:/^[^\d\.][0-9|A-Z|a-z]{5,16}/
	};

	regFun = {
		checkFun:function(obj,regex,oVal){

			if(!regex.test($(obj).val())){
				$(obj).removeClass('right').addClass('error');
				$(obj).val('');
				oVal == 'email' ? val.email = null 
					: (oVal == 'apass' ? val.apass = null 
						: (oVal == 'bpass' ? val.bpass = null 
							:(oVal == 'vpass'?oVal.vpass = null : console.log('val.error'))))
				
			}else if(($(obj).data('name')=='bpass')&&($(obj).val() !== val.apass)){
				$(obj).removeClass('right').addClass('error');
				$(obj).val('');
				val.bpass = null;
			}else{
				$(obj).removeClass('error').addClass('right');
				oVal == 'email' ? val.email = $(obj).val() 
					: (oVal == 'apass' ? val.apass = $(obj).val()
						: (oVal == 'bpass' ? val.bpass = $(obj).val() 
							:(oVal == 'vpass' ? val.vpass = $(obj).val() : console.log('val.error'))))
			}
		},

		checkFormat:function(obj){

			if(($(obj).hasClass('email'))){
				regFun.checkFun($(obj),regex.email,$(obj).data('name'));
			}else if(($(obj).hasClass('pass'))){
				regFun.checkFun($(obj),regex.pass,$(obj).data('name'));
			}
		},

		blurEvents:function(obj){
			$.each(obj,function(i,n){
				var objClass = $(n).data('name');
				$(document).on('blur','.'+objClass,function(){
					regFun.checkFormat($(n));
				});
			});	
		},

		addUserTab:function(){
			$('.top').append(t.tpl.userTab);
			$('.sign-log').remove();
		},

		regEvent:function(){
			$('.register').on('click',function(){
				if($('.error').length == 0){
					$.ajax({
							url:'/signUp',
							type:'post',
							data:{
								eMail:val.email,
								passWd:md5.md5(val.bpass),
								nickName:null,
							},
							dataType:'json',
							success:function(r){
								if(r.data.code=='0'){
									$.toast(r.data.msg);
									$('.sunrise').click();
									setTimeout(function(){
										window.location = 'http://www.nostory.cn/i/square.html';
									},1500);
									
								}else{
									$.toast(r.data.msg);
									$('input').val(' ').blur();
									console.log("r",r);
								}
							}
						}
					);	
				}else{
					$('.email').focus();
					$('.error').focus();
				}
			});
		},

		logEvent:function(){
			$('.login').on('click',function(){
				if($('.error').length == 0){
					$.ajax({
							url:'/logIn',
							type:'post',
							data:{
								eMail:val.email,
								passWd:md5.md5(val.vpass),
							},
							dataType:'json',
							success:function(r){
								if(r.data.code=='0'){
									$.toast(r.data.msg);
									$('.sunrise').click();
									regFun.addUserTab();		
								}else{
									$.toast(r.data.msg);
									$('input').val(' ').blur();
									console.log("r",r);
								}
							}
						}
					);	
				}else{
					$('.email').focus();
					$('.error').focus();
				}
			});
		}
	};

	init = function(){
		regFun.blurEvents([$('.email'),$('.apass'),$('.bpass'),$('.vpass')]);
		regFun.regEvent();
		regFun.logEvent();
		$('input.email').focus();
	}

	return{
		init:init
	}
});
