/*
* Cookie Module
* 2016.01.02 @ lin 
*/

var sId = null,
	uId = null;

exports.init = function(req,res){
	var cookieSID = getCookie(req,res);
	if(req.url == '/cookie'){
		if(cookieSID){
			returnCookie(req,res);
		}
	}
	return cookieSID;
}

getCookie = function(req,res){
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(";").forEach(function(Cookie){
    	var parts = Cookie.split("=");
    	Cookies[parts[0].trim()] = (parts[1]||''.trim());
    })
    console.log("cookieInCookie:",Cookies);
    return Cookies;
    
};

returnCookie = function(req,res){
	res.writeHead(200,{"Content-Type":"application/json"});
	var output = {error:null,cookies:{SID:sId,UID:uId}};
	res.end(JSON.stringify(output) + "\n");
}