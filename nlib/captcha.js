/*
* 验证码相关 node 
* 16.05.02 @ lin
*/

var captcha = require('node-captcha'),
	httpRes = require('./httpRes'); 

var captchaText = null;
	

/*
  Function @ generateCaptcha
  param @ none
*/
exports.generateCaptcha = function(req,res){
	var options = {
		fileMode:1,
		saveDir:'/root/nostory/capt',
		size:4,
		width:160,
		height:80,
		color:'rgb(165,197,245)',
		background:'rgb(251,251,251)',
	};

	captcha(options,function(text,data){
		captchaText = text;
		var imageUrl = 'http://www.nostory.cn/capt/' + data;
		httpRes.sendSuccess_nc(res,{"code":"0","msg":"Get captcha successfully!","imageUrl":imageUrl,"text":text});
	});
};

/*
  Function @ verifyCaptcha
  param @ captUser : captcha text from user-input
*/
exports.verifyCaptcha = function(captUser){
	//TODO
};
