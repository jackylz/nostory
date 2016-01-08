/*
* 程序入口 app.js - node 
* 15.11.30 @ lin
*/
var http = require('http'),
	urltool = require('url'),
	qs = require('querystring');
	
var users = require('./nlib/users'),
	cookie = require('./nlib/cookie');

function reqEntry(req,res){
	console.log("incoming request: " + req.method + "" + req.url);
	var a = urltool.parse(req.url,true).query;
	console.log("name&pwd:",a.name+":"+a.pwd);
	console.log("reqbody",req.url);
	console.log("ip:",req.headers['x-forwarded-for']);

	cookie.init(req,res);

	if(req.url.substr(0,7) == '/signUp'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));		
			var uId = param['uId'],
				eMail = param['eMail'],
				passWd = param['passWd'];
			users.regHandle(res,uId,eMail,passWd);
		});
	}

	if(req.url.substr(0,6) == '/logIn'){
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
	}

	if(req.url.substr(0,8) == '/addPost'){
		var postData = "";
		req.on('data',function(chunk){
			postData += chunk;
		});
		req.on('end',function(){
			var param = qs.parse(postData.toString('utf-8'));
			var uId = param['uId'],
				title = param['title'],
				content = param['content'];
			users.publish(res,uId,title,content);
		});
	}
}

var s = http.createServer(reqEntry);
s.listen(8080);