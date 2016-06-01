/*
* 用户流程相关 node 
* 15.11.30 @ lin
*/

var mongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	objectId = require('mongodb').ObjectID,
	dbUrl = 'mongodb://127.0.0.1:27017/nostory',
	moment = require('moment');

var httpRes = require('./httpRes');

/*
* 用户注册逻辑
* regHandle
*/
exports.regHandle = function(res,nickName,eMail,passWd,captcha){

	var queryDocument = function(db,callback){
		var cursor = db.collection('users').find({"eMail":eMail});
		var i = 0;
		cursor.each(function(err,doc){
			assert.equal(err,null);
			if(err){
				console.log('err',err);
			}else if(eMail == undefined||passWd == undefined){
				httpRes.sendSuccess_nc(res,{"code":"2","msg":"参数错误！"});
			}else if(doc != null){
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"该邮箱已注册，请更换"});
				console.log("Have been registered.");
				db.close();
				i++;
			}else if((i==0)&&(doc == null)){
				insertDocument(db,function(r){
					console.log(r);
					httpRes.sendSuccess(res,{"code":"0","msg":"注册成功"},eMail,r.ops[0].uId);
					console.log("Inserted successfully");
					db.close();
				});	
			}
		});
	};

	var insertDocument = function(db,callback){
		var counts = null; 
		db.collection('users').find().toArray().then(function(docs){
			console.log('dl:',10000+docs.length);
			var counts = String(10000 + docs.length);
			db.collection('users').insertOne({
				"uId":counts,
				"eMail":eMail,
				"passWd":passWd,
				"nickName":nickName,
				"avatarUrl":"http://www.nostory.cn/images/ds.jpg",
				"totalVote":"0",
				"totalDown":"0",
				"userTag":[],
				"area":"",
				"company":"",
				"jobTitle":"",
				"college":"",
				"major":"",
				"wechat":"",
				"location":"",
				"hometown":"",
				"watchCount":"0",
				"privacy":"0",
				"regDate":moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
				"regTimeStamp":new Date().getTime()
			},function(err,result){
				callback(result);
			});
			db.collection('fellowing').insertOne({"uId":counts,fellowingList:[]});
			db.collection('fellowed').insertOne({"uId":counts,fellowedList:[]});
		});		
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
};

/*
* 用户登陆逻辑
* logHandle
*/
exports.logHandle = function(res,eMail,passWd){

	var queryDocument = function(db,callback){
		var cursor = db.collection('users').find({"eMail":eMail});
		console.log('cursor',cursor);
		if(!cursor){
			httpRes.sendSuccess_nc(res,{"code":"2","msg":"登陆失败，服务器连接出错"});
			console.log("failed to Log in.");
			db.close();
		}else{
			cursor.each(function(err,doc){
				assert.equal(err,null);
				console.log("doc:",doc);
				if(err){
					console.log('err',err);
				}else if(doc != null){
					if(doc.passWd == passWd){
						httpRes.sendSuccess(res,{"code":"0","msg":"登陆成功"},eMail,doc.uId);
						console.log("Welcome.");
						console.log("doc.mail:",doc.eMail)
						db.close();
					}else if(doc.passWd != passWd){
						httpRes.sendSuccess_nc(res,{"code":"1","msg":"登陆失败，用户名或密码错误"});
						console.log("pwd wrong.");
						db.close();
					}
				}else{
					httpRes.sendSuccess_nc(res,{"code":"1","msg":"登陆失败，用户名不存在"});
					console.log("username is not found.");
					db.close();
				}
			});
		}
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
};

exports.changePassWd = function(res,uid,passWd,newPassWd){
	var queryDocument = function(db){
		var cursor = db.collection('users').find({"uId":uid});
		cursor.each(function(err,doc){
			console.log("cpdoc:",doc);
			if(err){
				console.log("cperr",err);
			}else if(doc != null){
				if(doc.passWd == passWd){
					updateDocument(db,function(rs){
						console.log('cprs:',rs);
						httpRes.sendSuccess_nc(res,{"code":"0", "msg":"修改密码成功，请重新登录"});
						db.close();
					});
				}else{
					httpRes.sendSuccess_nc(res,{"code":"1", "msg":"密码错误"});
					db.close();
				}
			}
		});
	}; 

	var updateDocument = function(db,callback){
		db.collection('users').update(
			{"uId":uid},
			{$set:{"passWd":newPassWd}},
			function(err,rs){
				if(err){
					console.log("iderr",err);
				}else{
					callback(rs);
				}
			});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
};

/*
* 获取用户信息，包括 users表中所有内容以及关注被关注数，文章数
* 
*/
exports.getUserInfo = function(res,uid){

	var queryDocument = function(db,callback){
		
		var dataInfo = null,
			fellowedCount = null,
			fellowingCount = null,
			articleCount = null;

		//查询用户信息
		db.collection('users').find({"uId":uid},function(err,rs){
			rs.each(function(err,doc){
				assert.equal(err,null);
				console.log("qdoc:",doc);
				if(err){
					console.log('err',err);
				}else if(doc != null){
					dataInfo = doc;
					console.log("dataInfo:",dataInfo);
				}
			});
		});
		
		db.collection('fellowing').find({"uId":uid},function(err,rs){
			rs.each(function(err,doc){
				console.log("fdoc:",doc);
				if(err){
					console.log('err',err);
				}else if(doc != null){
					fellowingCount = doc.fellowingList.length;
					console.log("fellowingCount:",fellowingCount);
				}
			});
		});

		db.collection('fellowed').find({"uId":uid},function(err,rs){
			rs.each(function(err,doc){
				console.log("fdoc:",doc);
				if(err){
					console.log('err',err);
				}else if(doc != null){
					fellowedCount = doc.fellowedList.length;
					console.log("fellowedCount:",fellowedCount);
					db.collection('article').find({"uId":uid}).toArray().then(function(rs){
						articleCount = rs.length;
						console.log('rl',rs.length);
						console.log("cbDataInfo",dataInfo);
						var dataCount = {"fellowingCount":fellowingCount,"fellowedCount":fellowedCount,"articleCount":articleCount};
						httpRes.sendSuccess_nc(res,{"code":"0","msg":"查询成功","dataList":dataInfo,"count":dataCount});
					});
				}
			});
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
};

/*
* 修改用户资料
* changeUserInfo
*/
exports.changeUserInfo = function(res,uid,item,value){
	var updateDocument = function(db,callback){
		var tmp = "{"+item+":\""+value+"\"}";
		var set = eval("("+tmp+")");
		console.log(set);
		db.collection('users').update(
			{"uId":uid},
			{$set:set},
			function(err,rs){
				if(err){
					console.log("iderr",err);
					httpRes.sendSuccess_nc(res,{"code":"1","msg":"修改失败！"});

				}else{
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"修改成功！"});
					db.close();
				}
			}
		);
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			updateDocument(db);
		}
	});
};

/*
* 增加用户标签
* addUserTag
*/
exports.addUserTag = function(res,uid,tag){
	var updateDocument = function(db,callback){
		db.collection('users').find({"uId":uid}).toArray().then(function(docs){
			if(docs[0].userTag.some(function(a){ return a == tag})){
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"已存在该标签！"});
			}else{
				db.collection('users').update(
					{"uId":uid},
					{$push:{"userTag":tag}},
					function(err,rs){
						if(err){
							console.log("iderr",err);
							httpRes.sendSuccess_nc(res,{"code":"1","msg":"修改失败！"});
							db.close();
						}else{
							httpRes.sendSuccess_nc(res,{"code":"0","msg":"修改成功！","addedTag":tag});
							db.close();
						}
					}
				);
			}
		});
		
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			updateDocument(db);
		}
	});
};

/*
* 删除用户标签
* removeUserTag
*/
exports.removeUserTag = function(res,uid,tag){
	var updateDocument = function(db,callback){
		db.collection('users').find({"uId":uid}).toArray().then(function(docs){
			if(!docs[0].userTag.some(function(a){ return a == tag})){
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"不存在该标签！"});
			}else{
				db.collection('users').update(
					{"uId":uid},
					{$pull:{"userTag":tag}},
					function(err,rs){
						if(err){
							console.log("iderr",err);
							httpRes.sendSuccess_nc(res,{"code":"1","msg":"修改失败！"});
							db.close();
						}else{
							httpRes.sendSuccess_nc(res,{"code":"0","msg":"修改成功！","reomvedTag":tag});
							db.close();
						}
					}
				);
			}
		});
		
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			updateDocument(db);
		}
	});
};



/*
* 修改用户隐私设置
* changeprivacy
*/
exports.changePrivacy = function(res,uid,status){
	var updateDocument = function(db,callback){
		db.collection('users').update(
			{"uId":uid},
			{$set:{"privacy":status}},
			function(err,rs){
				if(err){
					console.log("iderr",err);
					httpRes.sendSuccess_nc(res,{"code":"1","msg":"修改失败！"});
					db.close();
				}else{
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"修改成功！"});
					db.close();
				}
			}
		);
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			updateDocument(db);
		}
	});
};


/** Management Backend **/
/*
* 管理员登陆
* suLog:userName,passWd
*/
exports.suLog = function(res,name,passwd){

	var queryDocument = function(db,callback){
		var cursor = db.collection('admin').find({"name":name});
		cursor.each(function(err,doc){
			assert.equal(err,null);
			console.log("doc:",doc);
			if(err){
				console.log('err',err);
			}else if(doc != null){
				if(doc.passwd == passwd){
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"登陆成功","name":doc.name,"identify":doc.passwd});
					db.close();
				}else if(doc.passwd != passwd){
					httpRes.sendSuccess_nc(res,{"code":"1","msg":"登陆失败，用户名或密码错误"});
					console.log("pwd wrong.");
					db.close();
				}
			}else{
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"登陆失败，用户名不存在"});
				console.log("username is not found.");
				db.close();
			}
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
}

/*
* getAdmin
*/
exports.getAdmin = function(res,name){
	var queryDocument = function(db,callback){
		var cursor = db.collection('admin').find({"name":name});
		cursor.each(function(err,doc){
			assert.equal(err,null);
			console.log("doc:",doc);
			if(err){
				console.log('err',err);
			}else if(doc != null){
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取成功","role":doc.role});
				db.close();
			}else{
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"错误！用户名不存在"});
				console.log("username is not found.");
				db.close();
			}
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
};

/*
* 管理员获取用户列表
* getUserList
*/
exports.getUserList = function(res){
	var queryDocument = function(db,callback){
		db.collection('users').find({}).sort({"uId":1}).toArray().then(function(docs){
			if(docs!=null){
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取成功","userList":docs});
				db.close();
			}else{
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"错误！"});
				db.close();
			}
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db);
		}
	});
};

/*
* 管理员删除用户
* deleteUser
*/
exports.deleteUser = function(res,uid){
	var removeDocument = function(db,callback){
		db.collection('users').deleteOne({"uId":uid},function(err,rs){
			if(err){
				console.log('duerr',err);
			}else{
				callback();
			}
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			removeDocument(db,function(){
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"删除成功!"});
				db.close();
			});
		}
	});
};



