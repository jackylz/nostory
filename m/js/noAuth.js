;(function(){
	$(function(){
		function initRem(callback){
	        //适配代码 px->rem
	        var funcRun = false;
	        window.onresize = r;
	        function r(resizeNum){
	            var winW = window.innerWidth;
	            document.getElementsByTagName("html")[0].style.fontSize = winW*0.15625+"px";
	            if(winW > window.screen.width && resizeNum <= 10) {
	                setTimeout(function(){
	                    r(++resizeNum)   
	                }, 100);
	            }
	            else {
	                document.getElementsByTagName("body")[0].style.opacity = 1;
	                if(callback&&!funcRun){
	                    callback();
	                    funcRun = true;
	                } 
	            }
	        }
	        setTimeout(function(){r(0)}, 100);
	    }

	    initRem(function(){
	    	noAuth.init();
	    })
	});

	tpl = {
		regHtml : "<div class=\"input-wrap\">\
                        <input type=\"text\" class=\"username\" placeholder=\"用户名\" required/>\
                    </div>\
                    <div class=\"input-wrap\">\
                        <input type=\"text\" class=\"usermail\" placeholder=\"邮箱\" required/>\
                    </div>\
                    <div class=\"input-wrap\">\
                        <input type=\"password\" class=\"passwd\" placeholder=\"密码\" required/>\
                    </div>\
                    <div class=\"input-wrap\">\
                        <input type=\"password\" class=\"re-passwd\" placeholder=\"确认密码\" required/>\
                    </div>\
                    <div class=\"input-wrap no-border-bottom captcha clearfix\">\
                        <input type=\"text\" placeholder=\"验证码\" class=\"captcha-input\" required/>\
                        <div class=\"captcha-img\"></div>\
                    </div>\
                    <a href=\"javascript:;\" class=\"btn-submit go-reg\">注册</a>",

        logHtml : "<div class=\"input-wrap\">\
                        <input type=\"text\" class=\"usermail\" placeholder=\"邮箱\" required/>\
                    </div>\
                    <div class=\"input-wrap\">\
                        <input type=\"password\" class=\"passwd\" placeholder=\"密码\" required/>\
                    </div>\
                    <div class=\"input-wrap no-border-bottom captcha clearfix\">\
                        <input type=\"text\" placeholder=\"验证码\" class=\"captcha-input\" required/>\
                        <div class=\"captcha-img\"></div>\
                    </div>\
                    <a href=\"javascript:;\" class=\"btn-submit go-log\">登陆</a>",
        empty : {
        			userName:"<span class=\"error\">请输入用户名</span>",
        			userMail:"<span class=\"error\">请输入邮箱地址</span>",
        			passwd:"<span class=\"error\">请输入密码</span>",
        			rePasswd:"<span class=\"error\">请再次输入密码</span>",
        			captcha:"<span class=\"error\" style=\"right:2rem;\">请输入验证码</span>",
		},
        error : {
        			userName:"<span class=\"error\">用户名格式不正确</span>",
        			userMail:"<span class=\"error\">邮箱地址格式不正确</span>",
        			passwd:"<span class=\"error\">两次密码输入不一致</span>",
        			captcha:"<span class=\"error\" style=\"right:2rem;\">验证码错误</span>",
        }
	};

	regex = {
		email:/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+.)+([a-zA-Z]{2,4})+$/,
		pass:/^[^\d\.][0-9|A-Z|a-z]{5,16}/
	};

	noAuth = {
		init:function(){
			console.log('reg init..');
			this.tabChange();
			this.getCaptchaAjax($('.captcha-img'));
			this.getCaptchaEvent();
			this.checkFun();
			this.regEvent();
			this.logEvent();
		},

		/*
		* Function tabChange
		* 切换注册登录tab
		*/
		tabChange:function(){
			$('.tab-no-auth').find('a').on('click',function(){
				self = $(this);
				if(!self.hasClass('active')){
					self.parent().find('a').removeClass('active');
					self.addClass('active');
					if(self.index() == 0){
						self.parent().parent().find('.input-list').html(tpl.regHtml);
						noAuth.init();
					}else{
						self.parent().parent().find('.input-list').html(tpl.logHtml);
						noAuth.init();
					}
				}
			});
		},

		/*
		* Function getCaptchaEvent
		* 为验证图片增加点击替换事件
		*/
		getCaptchaEvent:function(){
			$('.captcha-img').on('click',function(){
				var self = $(this);
				noAuth.getCaptchaAjax(self);
				self.parent().find('.captcha-input').blur();
			});
		},

		/*
		* Function getCaptcha
		* param obj : 添加的dom对象
		* ajax获取验证码图片
		*/
		getCaptchaAjax:function(obj){
			$.ajax({
				url:"/getCaptcha",
				type:'GET',
				dataType:'json',
				success:function(r){
					if(r.data.code == '0'){
						obj.attr('style','background:url('+r.data.imageUrl+') no-repeat;background-size: 1.6rem .8rem;');
						obj.attr('data-code','010'+r.data.text);	
					}
				}
			});
		},

		/*
		* Function getCaptcha
		* 获取验证码图片
		*/
		verifyCaptcha:function(){

		},

		/*
		* Function checkFun
		* 检查输入合法性
		*/
		checkFun:function(){
			$('input').on('focusout',function(){
				var self = $(this);
				var tmpTpl = null;
				if(self.val() == ""){
					switch(self.attr('class')){
						case 'username':
							tmpTpl = tpl.empty.userName;
							break;
						case 'usermail':
							tmpTpl = tpl.empty.userMail;
							break;
						case 'passwd':
							tmpTpl = tpl.empty.passwd;
							break;
						case 're-passwd':
							tmpTpl = tpl.empty.rePasswd;
							break;
						case 'captcha-input':
							tmpTpl = tpl.empty.captcha;
							break;
						default:
							tmpTpl = null;
					}
					console.log(tmpTpl);
					self.parent().find('.error').remove();
					self.parent().append(tmpTpl);

				}else if(self.attr("class") == "usermail"){
					var tmpVal = self.val();
					if(!regex.email.test(tmpVal)){
						self.parent().find('.error').remove();
						self.parent().append(tpl.error.userMail);
					}else{
						self.parent().find('.error').remove();
					}
				}else if(self.attr("class") == "passwd" || self.attr("class") == "re-passwd"){
					var tmpVal = self.val();
					if(!regex.pass.test(tmpVal)){
						self.parent().find('.error').remove();
						self.parent().append(tpl.error.passwd);
					}else{
						self.parent().find('.error').remove();
					}
					if($('.re-passwd').index() != -1 && ($('.passwd').val()!=$('.re-passwd').val())){
						self.parent().find('.error').remove();
						self.parent().append(tpl.error.passwd);
					}else{
						$('.passwd,.re-passwd').parent().find('.error').remove();
					}
				}else if(self.attr("class") == "captcha-input"){
					var theCode = $('.captcha-img').attr('data-code').substr(3,4);
					if(self.val() != theCode ){
						self.parent().find('.error').remove();
						self.parent().append(tpl.error.captcha);
					}else{
						self.parent().find('.error').remove();
					}
				}else{
					self.parent().find('.error').remove();
				}
			});
		},		

		regEvent:function(){
			$('.go-reg').on('click',function(){
				$('input').blur();
				if($('.error').length == 0){
					console.log('Valid Data.');
					$.ajax({
						url:'/signUp',
						type:'post',
						data:{
							eMail:$('.usermail').val(),
							passWd:md5($('.passwd').val()),
							nickName:$('.username').val()
						},
						dataType:'json',
						success:function(r){
							if(r.data.code=='0'){
								setTimeout(function(){
									window.location = 'http://m.nostory.cn/';
								},1500);
								
							}else{
								console.log("r",r);
							}
						}
					});	
				}else{
					$('.usermail').focus();
				}
			});
		},

		logEvent:function(){
			$('.go-log').on('click',function(){
				$('input').blur();
				if($('.error').length == 0){
					$.ajax({
							url:'/logIn',
							type:'post',
							data:{
								eMail:$('.usermail').val(),
								passWd:md5($('.passwd').val()),
							},
							dataType:'json',
							success:function(r){
								if(r.data.code=='0'){
									setTimeout(function(){
										window.location = 'http://m.nostory.cn/';
									},1500);
								}else{
									console.log("r",r);
								}
							}
						}
					);	
				}else{
					$('.usermail').focus();
				}
			});
		},
	};
})()