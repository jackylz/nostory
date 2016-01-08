/*
* 用户流程相关 node 
* 15.11.30 @ lin
*/

var mongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	objectId = require('mongodb').ObjectID,
	dbUrl = 'mongodb://127.0.0.1:27017/nostory',
	moment = require('moment');

/*
* 用户注册逻辑
* regHandle
*/
exports.regHandle = function(res,uId,eMail,passWd){

	var queryDocument = function(db,callback){
		var cursor = db.collection('users').find({"eMail":eMail});
		var i = 0;
		cursor.each(function(err,doc){
			assert.equal(err,null);
			if(err){
				console.log('err',err);
			}else if(eMail == undefined||passWd == undefined){
				send_success_nc(res,{"code":"2","msg":"参数错误！"});
			}else if(doc != null){
				send_success_nc(res,{"code":"1","msg":"该邮箱已注册，请更换"});
				console.log("Have been registered.");
				db.close();
				i++;
			}else if((i==0)&&(doc == null)){
				insertDocument(db,function(){
					send_success(res,{"code":"0","msg":"注册成功"},eMail,1000);
					console.log("Inserted successfully");
					db.close();
				});	
			}
		});
	};

	var insertDocument = function(db,callback){
		db.collection('users').insertOne({
			"uId":uId,
			"eMail":eMail,
			"passWd":passWd,
			"nickName":null,
			"regDate":moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
		},function(err,result){
			callback(result);
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			send_failure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});

	var insertDocument = function(db,callback){
		db.collection('users').insertOne({
			"uId":uId,
			"eMail":eMail,
			"passWd":passWd,
			"nickName":null,
			"regDate":moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
		},function(err,result){
			callback(result);
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			send_failure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
}

/*
* 用户登陆逻辑
* logHandle
*/
exports.logHandle = function(res,eMail,passWd){

	var queryDocument = function(db,callback){
		var cursor = db.collection('users').find({"eMail":eMail});
		var i = 0;
		cursor.each(function(err,doc){
			assert.equal(err,null);
			console.log("doc:",doc)
			if(err){
				console.log('err',err);
			}else if(doc != null&&doc.passWd === passWd){
				send_success(res,{"code":"0","msg":"登陆成功"},eMail,1001);
				console.log("Welcome.");
				console.log("doc.mail:",doc.eMail)
				db.close();
				i++;
			}else if(doc != null&&doc.passWd !== passWd){
				send_success_nc(res,{"code":"1","msg":"登陆失败，用户名或密码错误"});
				console.log("failed to Log in.");
				db.close();
			}else if((i==0)&&(doc == null)){
				send_success_nc(res,{"code":"2","msg":"登陆失败，服务器连接出错"});
				console.log("failed to Log in.");
				db.close();
			}
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			send_failure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
}

/*
* 文章发布
* publish
*/
exports.publish = function(res,uId,title,content){

	var queryDocument = function(db,callback){
		var cursor = db.collection('users').find({"uId":uId});
		var i = 0;
		cursor.each(function(err,doc){
			assert.equal(err,null);
			if(err){
				console.log('err',err);
			}else if(eMail == undefined||passWd == undefined){
				send_success_nc(res,{"code":"2","msg":"参数错误！"});
			}else if(doc != null){
				send_success_nc(res,{"code":"1","msg":"该邮箱已注册，请更换"});
				console.log("Have been registered.");
				db.close();
				i++;
			}else if((i==0)&&(doc == null)){
				insertDocument(db,function(){
					send_success(res,{"code":"0","msg":"注册成功"},eMail,1000);
					console.log("Inserted successfully");
					db.close();
				});	
			}
		});
	};

	var insertDocument = function(db,callback){
		db.collection('article').insertOne({
			"uId":uId,
			"title":title,
			"content":content,
			"postDate":moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
		},function(err,result){
			callback(result);
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			send_failure(res,500,err);
		}else{
			assert.equal(err,null);
			insertDocument(db,function(r){
				if(!r){
					console.log('err!');
				}else{
					send_success_nc(res,{"code":"0","msg":"发表文章成功"});
				}
			});
		}
	});

}

function send_success_nc(res,data){
	res.writeHead(200,{"Content-Type":"application/json"});
	var output = {error:null,data:data};
	res.end(JSON.stringify(output) + "\n");
}
function send_success(res,data,SID,UID){
	var date=new Date();
	var expireDays=1;
	date.setTime(date.getTime()+expireDays*24*3600*1000);
	res.writeHead(200,{"Set-Cookie":"SID="+SID+";UID="+ UID +";domain=.nostory.cn;Expries="+date.toGMTString(),
			"Content-Type":"application/json"});
	var output = {error:null,data:data};
	res.end(JSON.stringify(output) + "\n");
}
function send_failure(res,code,err){
	var code = (err.code) ? err.code : err.name;
	res.writeHead(code,{"Content-Type":"application/json"});
	res.end(JSON.stringify({error:code,message:err.message}) + "\n");
}