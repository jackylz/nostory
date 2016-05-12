define('template',function(){

	tpl = {
		reg:"<div class=\"box sign-box\"><i class=\"icon icos close-ico\"></i>\
				<div class=\"box-title\">注 册️</div>\
				<div class=\"sub-title\">Open your Mind.</div>\
				<input type=\"text\" class=\"input reg-username \" data-name=\"username\" placeholder=\"用户名昵称\" maxlength=\"24\">\
				<input type=\"text\" class=\"input email \" data-name=\"email\" placeholder=\"邮箱地址\" maxlength=\"24\">\
				<input type=\"password\" class=\"input pass apass\" data-name=\"apass\" placeholder=\"密码(6-16位)\" maxlength=\"18\">\
				<input type=\"password\" class=\"input pass bpass\" data-name=\"bpass\" placeholder=\"确认密码\" maxlength=\"18\">\
				<div class=\"button register\">注册</div>\
			</div>",
		log:"<div class=\"box log-box\" style=\"min-height:350px\"><i class=\"icon icos close-ico\"></i>\
				<div class=\"box-title\">登 录</div>\
				<div class=\"sub-title\">Keep your road.</div>\
				<input type=\"text\" class=\"input email\" data-name=\"email\" placeholder=\"邮箱地址\" maxlength=\"24\">\
				<input type=\"password\" class=\"input pass vpass\" data-name=\"vpass\" placeholder=\"密码\" maxlength=\"18\">\
				<div class=\"button login\">登录</div>\
			</div>",

		unLog:"<ul class=\"sign-log\">\
				<li><a href=\"javascript:void(0);\" class=\"reg-btn\">注册</a></li>\
				<li><a href=\"javascript:void(0);\" class=\"log-btn\">登录</a></li>\
			</ul>"
	}

	return { tpl:tpl}
});