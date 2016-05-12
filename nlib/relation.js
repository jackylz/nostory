/*
* 用户关系相关 node 
* 16.05.11 @ lin
*/

var mongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	objectId = require('mongodb').ObjectID,
	dbUrl = 'mongodb://127.0.0.1:27017/nostory',
	moment = require('moment');

var httpRes = require('./httpRes');

/*
* 关注动作
* uid 关注 _uid
*/
exports.fellowAction = function(res,uid,_uid){

	var queryDocument = function(db,callback){
		//被行为者成为行为者的关注者
		db.collection('fellowing').update({"uId":uid},{$push:{"fellowingList":{"uId":_uid}}});

		//行为者成为被行为者的粉丝
		db.collection('fellowed').update({"uId":_uid},{$push:{"fellowedList":{"uId":uid}}},function(){
			httpRes.sendSuccess_nc(res,{"code":"0","msg":"关注成功"});
			db.close();
		});
	};

	// var insertDocument = function(db,uid,data){
	// 	db.collection('fellowing').update({"uId":uid},{$push:{"fellowingList":data}});
	// 	db.collection('fellowed').update({"uId":_uid},{$push:{"fellowedList":data}});
	// };

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
* 取消关注动作
* uid 关注 _uid
*/
exports.unFellowAction = function(res,uid,_uid){

	var updateDocument = function(db,callback){
		//将被行为者从行为者的关注列表中移除
		db.collection('fellowing').update({"uId":uid},{$pull:{"fellowingList":{"uId":_uid}}});
		//将行为者从被行为者的粉丝列表中移除
		db.collection('fellowed').update({"uId":_uid},{$pull:{"fellowedList":{"uId":uid}}},function(){
			httpRes.sendSuccess_nc(res,{"code":"0","msg":"果取关成功"});
			db.close();
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
* 获取关注状态，0未关注，1关注，2被关注，3互相关注好友
* uid 查询 _uid
*/
exports.getRelation = function(res,uid,_uid){

	var queryDocument = function(db){
		//查看行为者是否关注了被行为者
		db.collection('fellowing').find({"uId":uid,"fellowingList":{"uId":_uid}}).toArray().then(function(r){
			
			var flag = 0;
			if(r.length>0){ 
				flag = 1;
			}else{
				flag = 0;
			}

			//查看被行为者是否关注行为者
			db.collection('fellowing').find({"uId":_uid,"fellowingList":{"uId":uid}}).toArray().then(function(rs){
				if( flag==1 && rs.length > 0 ){
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"好友关系","dataCode":3});
				}else if(flag == 0 && rs.length > 0){
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"TA关注了你","dataCode":2});
				}else if(flag ==1 && rs.length == 0){
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"你关注了TA","dataCode":1});
				}else if(flag == 0 && rs.length == 0){
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"你与TA互相未关注","dataCode":0});
				}
				db.close();
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

/** fellowed **/
/*
* 获取粉丝列表  
*/
exports.getFellowedList = function(res,uid){

	var queryDocument = function(db){
		var cursor = db.collection('fellowed').find({"uId":uid});
		cursor.each(function(err,doc){
			console.log('doc',doc);
			if(err){
				console.log(err);
			}else if(doc != null){
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取列表成功","list":doc.fellowedList})
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

/** fellowing **/
/*
* 获取关注列表  
*/
exports.getFellowingList = function(res,uid){

	var queryDocument = function(db){
		var cursor = db.collection('fellowing').find({"uId":uid});
		cursor.each(function(err,doc){
			console.log('doc',doc);
			if(err){
				console.log(err);
			}else if(doc != null){
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取列表成功","list":doc.fellowingList})
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








