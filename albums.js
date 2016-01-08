var http = require('http'),
	fs = require('fs');

function load_albums_list(callback){
	fs.readdir("albums",
		function (err,files){
			if(err){
				callback(make_error("file_error",JSON.stringify(err)));
				return;
			}

			var only_dirs = [];
			(function iterator(index) {
				if(index == files.length){
					callback(null,only_dirs);
					return;
				}

			fs.stat(
				"albums/"+files[index],
				function (err,stats){
					if(err){
						callback(make_error("file_error",JSON.stringify(err)));
						return;
					}
					if(stats.isDirectory){
						var obj = {name:files[index]};
						only_dirs.push(obj);
					}
					iterator(index+1);
				}
			);
			})(0);
		console.log(callback);
		}
	);
}

function load_album(album_name,callback){
	fs.readdir(
		"albums/" + album_name,
		function (err,files){
			if(err){
				if(err.code == "ENOENT"){
					callback(no_such_album());
 				} else {
 					callback(make_error("file_error",JSON.stringify(err)));
 				}
 				return;
			}
			var only_files = [];
			var path = "albums/" + album_name + "/";

			(function iterator(index){
				if(index == files.length){
					var obj = { short_name:album_name,photos:only_files};
					callback(null,obj);
					return;
				}

				fs.stat(path + files[index],
					function(err,stats){
						if(err){
							callback(make_error("file_error",JSON.stringify(err)));
							return;
						}
						if(stats.isFile()){
							var obj = { filename:files[index],
										desc:files[index]};
							only_files.push(obj);
						}
						iterator(index + 1);
					}
				);
			}
			)(0);
		}
	);
}
//	load_albums_list(
// 		function(err,albums){
// 			if(err){
// 				res.writeHead(503,{"Content-Type":"application/json"});
// 				res.end(JSON.stringify(err)+ "\n");
// 				return;
// 			}
// 			var out = {
// 				error:null,
// 				data:{albums:albums}
// 			};
// 			res.writeHead(200,{"Content-Type":"application/json"});
// 			res.end(JSON.stringify(out)+"\n");
// 		}
// 	); 
function handle_incoming_request(req,res){
	console.log("incoming request: " + req.method + "" + req.url);
	console.log(req.url);
	if(req.url =='/2'){
		handle_list_albums(req,res);
	}else if(req.url.substr(0,7)== '/albums' && req.url.substr(req.url.length - 4)=='.get'){
		handle_get_album(req,res);
	}else{
		console.log("no 1",req.url.substr(0,7)+"\n"+req.url.substr(req.url.length - 4));
		// res.writeHead(404);
		// res.end(fs.readFileSync("/root/test/error.html"));
		send_failure(res,404,invalid_resource());
	}
}

function handle_list_albums(req,res){
	console.log("wtf");
	load_albums_list(
		function(err,albums){
			if(err){
				send_failure(res,500,err);
				return;
			}

			send_success(res,{albums:albums});
		}
	);
}

function handle_get_album(req,res){
	console.log("wtf!!!");
	var album_name = req.url.substr(8);
	console.log(album_name);
	load_album(album_name,
		function (err,album_contents){
			if(err && err.error == "no_such_album"){
				send_failure(res,404,err);
			}else if(err){
				send_failure(res,500,err);
			}else{
				send_success(res,{album_data:album_contents});
			}
		}
	);
}

function make_error(err,msg){
	var e = new Error(msg);
	e.code = err;
	return e;
}
function send_success(res,data){
	res.writeHead(200,{"Content-Type":"application/json"});
	var output = {error:null,data:data};
	res.end(JSON.stringify(output) + "\n");
}
function send_failure(res,code,err){
	var code = (err.code) ? err.code : err.name;
	res.writeHead(code,{"Content-Type":"application/json"});
	res.end(JSON.stringify({error:code,message:err.message}) + "\n");
}
function invalid_resource(){
	return make_error("invalid_resource","The request resource does not exist.");
}
function no_such_album(){
	return make_error("no_such_album","The specified albums does not exist.");
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);
