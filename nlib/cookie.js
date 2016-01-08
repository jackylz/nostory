/*
* Cookie Module
* 2016.01.02 @ lin 
*/

var sId = null,
	uId = null;

exports.init = function(req,res){
	if(req.url.substr(0,7) == '/cookie'){
		if(getCookie(req,res)){
			returnCookie(req,res);
		}
	}
}

getCookie = function(req,res){
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(";").forEach(function(Cookie){
    	var parts = Cookie.split("=");
    	Cookies[parts[0].trim()] = (parts[1]||''.trim());
    })
    console.log("cookie:",Cookies);
    sId = Cookies.SID;
    return sId;
    
};

returnCookie = function(req,res){
	res.writeHead(200,{"Content-Type":"application/json"});
	var output = {error:null,cookies:{SID:sId,UID:uId}};
	res.end(JSON.stringify(output) + "\n");
}