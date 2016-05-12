/*
* 程序入口 app.js - node 
* 15.11.30 @ lin
*/
var http = require('http'),
	urltool = require('url'),
	qs = require('querystring');
	
var cookie = require('./nlib/cookie'),
	cap = require('./nlib/captcha'),
	httpRes = require('./nlib/httpRes');

var users = require('./nlib/users'),
	relation = require('./nlib/relation'),
	article = require('./nlib/article');

function reqEntry(req,res){
	console.log("incoming request: " + req.method + "" + req.url);
	var a = urltool.parse(req.url,true).query;

	var cookies = cookie.init(req,res);

	/* 调试模式 */
	var isDebug = true; 
	if(isDebug){
		console.log("name&pwd:",a.name+":"+a.pwd);
		console.log("reqbody",req.url);
		console.log("ip:",req.headers['x-forwarded-for']);
		console.log('cookie:',cookies);
	}
	
	/*
	* Router POST/signUp
	* 注册
	*/
	if(req.url == '/signUp'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));		
			var nickName = param['nickName'],
				eMail = param['eMail'],
				passWd = param['passWd'];
			users.regHandle(res,nickName,eMail,passWd);
		});
	}

	/*
	* Router POST/logIn
	* 登录
	*/
	if(req.url == '/logIn'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var eMail = param['eMail'],
				passWd = param['passWd'];
			users.logHandle(res,eMail,passWd);
		});
	};

	/*
	* Router POST/logOut
	* 登录
	*/
	if(req.url == '/logOut'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var eMail = param['eMail'],
				passWd = param['passWd'];
			users.logHandle(res,eMail,passWd);
		});
	};

	/*
	* Router POST/changePassWd
	* 修改密码
	*/
	if(req.url == '/changePassWd'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uid = param['uId'],
				passWd = param['passWd'],
				newPassWd = param['newPassWd'];
			users.changePassWd(res,uid,passWd,newPassWd);
		});
	};


	/*
	* Router POST/addPost
	* 发表文章
	*/
	if(req.url == '/addPost'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uId = param['uId'],
				title = param['title'],
				content = param['content'],
				raw = param['raw'],
				tag = param['tag'];
			article.publish(res,uId,title,content,raw,tag);
		});
	}

	/*
	* Router POST/getArticle
	* 获取文章
	*/
	if(req.url == '/getArticle'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uId = param['uId'],
				page = param['page'],
				pageSize = param['pageSize'];
			article.getArticle(res,uId,page,pageSize);
		});
	}

	/*
	* Router POST/getArticleByUid
	* 获取文章 by Uid
	*/
	if(req.url == '/getArticleByUid'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uId = param['uId'],
				page = param['page'],
				pageSize = param['pageSize'];
			article.getArticleByUid(res,uId,page,pageSize);
		});
	}

	/*
	* Router POST/getArticleByAid
	* 获取文章 by Aid
	*/
	if(req.url == '/getArticleByAid'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var aid = param['articleId'];
			article.getArticleByAid(res,aid);
		});
	}

	/*
	* Router POST/getArticle
	* 获取文章
	*/
	if(req.url == '/getHotFeed'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uId = param['uId'],
				page = param['page'],
				pageSize = param['pageSize'];
			article.getHotFeed(res,uId,page,pageSize);
		});
	}

	/*
	* Router POST/vote
	* 赞同文章
	*/
	if(req.url == '/vote'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var aId = param['articleId'];
			article.voteArticle(res,aId);
		});
	}
	/*
	* Router POST/down
	* 赞同文章
	*/
	if(req.url == '/down'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var aId = param['articleId'];
			article.downArticle(res,aId);
		});
	}


	/* Captcha */
	/*
	* Router POST/getCaptcha
	* 获取验证码
	*/
	if(req.url == '/getCaptcha'){
		cap.generateCaptcha(req,res);
	};


	/***
	*** 个人信息部分－包括 添加个人信息、修改个人信息、获取关注(fellowing)列表、获取粉丝(fellower)列表、
	*** 获取好友(friend)列表、总文章数(articleCount)、密码修改、自设标签.
	***/


	/*
	* Router POST/changeUserInfo
	* keywords avatar/wechat/userTag/college/homeCity
	* 获取用户信息
	*/
	if(req.url == '/getUserInfo'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uid = param['uId'];
			users.getUserInfo(res,uid);
		});
	};

	/*
	* Router POST/changeUserInfo
	* 修改用户信息
	*/
	if(req.url == '/changedUserInfo'){
		//TODO
		users.changeUserInfo(res,name,value);
	};

	/*
	* Router POST/changePrivacy
	* 修改用户信息
	*/
	if(req.url == '/changePrivacy'){
		//TODO
		users.changePrivacy(res,uid,pCode);
	};

	/*
	* Router POST/getFellowingList
	* param:uid
	* 获取关注列表 
	*/
	if(req.url == '/getFellowingList'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uid = param['uId'];
			relation.getFellowingList(res,uid);
		});
	}

	/*
	* Router POST/getFellowedList
	* param:uid
	* 获取粉丝列表 
	*/
	if(req.url == '/getFellowedList'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uid = param['uId'];
			relation.getFellowedList(res,uid);
		});
	}

	/*
	* Router POST/getRelation
	* param:uid行为者,_uid被行为者
	* 获取粉丝列表 
	*/
	if(req.url == '/getRelation'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uid = param['uId'],
				_uid = param['_uId'];
			relation.getRelation(res,uid,_uid);
		});
	}

	/*
	* Router POST/fellow
	* param:uid,_uid,relationCode
	* 关注
	*/
	if(req.url == '/fellow'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uid = param['uId'],
				_uid = param['_uId'];
			relation.fellowAction(res,uid,_uid);
		});	
	}

	/*
	* Router POST/unfellow
	* param:uid,_uid,relationCode
	* 解除关注
	*/
	if(req.url == '/unfellow'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uid = param['uId'],
				_uid = param['_uId'];
			relation.unFellowAction(res,uid,_uid);
		});	
	}

	/** Management Backend **/
	/*
	* Admin Login
	* username,password
	*/
	if(req.url == '/suLog'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var username = param['userName'],
				password = param['passWd'];
			users.suLog(res,username,password);
		});	
	}

	/*
	* Get All Users List
	* getUserList
	*/
	if(req.url == '/getUserList'){
		users.getUserList();
	}

	/*
	* Delete User
	* deleteUser:uid
	*/
	if(req.url == '/deleteUser'){
		users.deleteUser();
	}


}

var s = http.createServer(reqEntry);
s.listen(8080);