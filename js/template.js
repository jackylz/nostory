define('template',function(){

	tpl = {
		reg:"<div class=\"box sign-box\"><i class=\"icon icos close-ico\"></i>\
				<div class=\"box-title\">Sign Up</div>\
				<div class=\"sub-title\">Open your Mind.</div>\
				<input type=\"text\" class=\"input email \" data-name=\"email\" placeholder=\"Email (foo@foo.foo)\" maxlength=\"24\">\
				<input type=\"password\" class=\"input pass apass\" data-name=\"apass\" placeholder=\"Password (6-16 digits)\" maxlength=\"18\">\
				<input type=\"password\" class=\"input pass bpass\" data-name=\"bpass\" placeholder=\"Verify Password\" maxlength=\"18\">\
				<div class=\"button register\">Register</div>\
				<div class=\"third-log\"><i class=\"icon third qq-ico\"></i>\
				<i class=\"icon third wx-ico\"></i>\
				<i class=\"icon third wb-ico\"></i></div>\
			</div>",
		log:"<div class=\"box log-box\"><i class=\"icon icos close-ico\"></i>\
				<div class=\"box-title\">Log In</div>\
				<div class=\"sub-title\">Keep your road.</div>\
				<input type=\"text\" class=\"input email\" data-name=\"email\" placeholder=\"Email\" maxlength=\"24\">\
				<input type=\"password\" class=\"input pass vpass\" data-name=\"vpass\" placeholder=\"Password\" maxlength=\"18\">\
				<div class=\"button login\">Login</div>\
				<div class=\"button register\">Register</div>\
				<div class=\"third-log\"><i class=\"icon third qq-ico\"></i>\
					<i class=\"icon third wx-ico\"></i>\
					<i class=\"icon third wb-ico\"></i></div>\
			</div>",

		userTab:"<div class=\"user-tab\">\
					<div class=\"user-info\">\
						<a href=\"/uid/000001\" class=\"user-link\">林振</a>\
					</div>\
					<div class=\"log-out\">\
						<a href=\"/logout\">退出</a>\
					</div>\
				</div>",

		unLog:"<ul class=\"sign-log\">\
				<li><a href=\"javascript:void(0);\" class=\"reg-btn\">Sign</a></li>\
				<li><a href=\"javascript:void(0);\" class=\"log-btn\">Log</a></li>\
			</ul>"
	}

	return { tpl:tpl}
});