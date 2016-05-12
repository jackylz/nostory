/*
* 返回http响应报文
* 
*/

/* Http success response without cookie */
exports.sendSuccess_nc = function(res,data){
	console.log(res);
	res.writeHead(200,{"Content-Type":"application/json"});
	var output = {error:null,data:data};
	res.end(JSON.stringify(output) + "\n");
}

/* Http success response with cookie-username */
exports.sendSuccess = function(res,data,SID,UID){
	var date=new Date();
	var expireDays=1;
	date.setTime(date.getTime()+expireDays*24*3600*1000);
	res.writeHead(200,{"Set-Cookie":"SIDUID="+SID+"&"+ UID +";domain=.nostory.cn;Expries="+date.toGMTString(),
			"Content-Type":"application/json"});
	var output = {error:null,data:data};
	res.end(JSON.stringify(output) + "\n");
}

/* Http failure response*/
exports.sendFailure = function(res,code,err){
	var code = (err.code) ? err.code : err.name;
	res.writeHead(code,{"Content-Type":"application/json"});
	res.end(JSON.stringify({error:code,message:err.message}) + "\n");
}