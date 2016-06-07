/*
* 文章相关 node 
* 16.05.12 @ lin
*/

var mongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	objectId = require('mongodb').ObjectID,
	dbUrl = 'mongodb://127.0.0.1:27017/nostory',
	moment = require('moment');

var httpRes = require('./httpRes');


/*
* 文章发布
* publish
*/
exports.publish = function(res,uId,title,content,raw,tag){

	var tagArr = tag?(tag.split('&').reverse().slice(1).reverse()):[];

	var queryDocument = function(db,callback){
		db.collection('users').find({"uId":uId}).toArray().then(function(rs){
			var author = rs[0].nickName;
			console.log("aut",rs[0]);
			db.collection('article').find().toArray().then(function(docs){
				var articleId = String(20000 + docs.length);
				db.collection('article').insertOne({
					"articleId":articleId,
					"uId":uId,
					"author":author,
					"title":title,
					"content":content,
					"raw":raw,
					"tag":tagArr,
					"vote":0,
					"down":0,
					"watchCount":"0",
					"discusList":[],
					"postDate":moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
				},function(err,result){
					if(err){console.log('err',err);}
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"发表文章成功"});
					console.log("Inserted successfully");
					db.close();
				});	
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
* 首页文章获取
* getArticle
*/
exports.getArticle = function(res,uid,page,pageSize){

	var queryDocument = function(db,callback){
		// var cursor = 
		db.collection('article').find().skip((Number(page)-1)*Number(pageSize)).limit(Number(pageSize)).sort({"postDate":-1}).toArray().then(function(rs){
			// console.log("gars:",rs);
			console.log("page_size:",pageSize);
			httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取文章列表成功","articleList":rs});
		});
	};
	
	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db,function(){
				db.close();
			});
		}
	});
};

/*
* 用户文章获取
* getArticleByUid
*/
exports.getArticleByUid = function(res,uid,page,pageSize){

	var queryDocument = function(db,callback){
		// var cursor = 
		db.collection('article').find({"uId":uid}).skip((Number(page)-1)*Number(pageSize)).limit(Number(pageSize)).sort({"postDate":-1}).toArray().then(function(rs){
			// console.log("gars:",rs);
			console.log("page_size:",pageSize);
			httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取文章列表成功","articleList":rs});
		});
	};
	
	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db,function(){
				db.close();
			});
		}
	});
};

/*
* 根据文章id获取文章内容
* getArticleByAid
*/
exports.getArticleByAid = function(res,aid){

	var queryDocument = function(db,callback){
		console.log('aid:',aid);
		db.collection('article').find({"articleId":aid}).toArray().then(function(rs){
			console.log('rs',rs);
			httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取文章成功","articleData":rs[0]});
		});
	};
	
	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db,function(){
				db.close();
			});
		}
	});
};

/*
* 赞同文章
* voteArticle
*/
exports.voteArticle = function(res,aid){
	var updateDocument = function(db,callback){
		db.collection('article').find({"articleId":aid}).toArray().then(function(rs){
			var newVote = Number(rs[0].vote)+1;
			db.collection('article').update({"articleId":aid},{$set:{"vote":newVote}});
			callback(newVote);
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			updateDocument(db,function(data){
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"赞同成功","newVote":data});
				db.close();
			});
		}
	});
}

/*
* 不赞同文章
* downArticle
*/
exports.downArticle = function(res,aid){
	var updateDocument = function(db,callback){
		db.collection('article').find({"articleId":aid}).toArray().then(function(rs){
			var newDown = Number(rs[0].down)+1;
			db.collection('article').update({"articleId":aid},{$set:{"down":newDown}});
			callback(newDown);
		});
	};

	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			updateDocument(db,function(data){
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"不赞同成功","newDown":data});
				db.close();
			});
		}
	});
}

/*
* 评论文章
* comments
* insert: ownerId,ownerName,replyTo*,replyToId*,content,date
*/
exports.comments = function(res,aid,oid,oName,replyTo,replyToId,content){
	console.log('2',aid);
	var updateDocument = function(db){
		db.collection('article').find({"articleId":aid}).toArray().then(function(rs){
			if(rs){
				console.log("3",rs);
				db.collection('article').update({"articleId":aid},{$push:{"discusList":{"ownerId":oid,"ownerName":oName,"replyTo":replyTo,"replyToId":replyToId,"content":content, "comDate":moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}}},function(){
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"评论成功!"});
					db.close();
				});
			}else{
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"评论失败!"});
				db.close();
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
}

/** Management Backend **/
exports.getArticleList = function(res){

	var queryDocument = function(db,callback){
		// var cursor = 
		db.collection('article').find().sort({"postDate":-1}).toArray().then(function(rs){
			httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取文章列表成功","articleList":rs});
		});
	};
	
	mongoClient.connect(dbUrl,function(err,db){
		if(err){
			httpRes.sendFailure(res,500,err);
		}else{
			assert.equal(err,null);
			queryDocument(db,function(){
				db.close();
			});
		}
	});
};


/*
* Delete Article
* Param:articleId
*/
exports.deleteArticle = function(res,articleId){
	var removeDocument = function(db,callback){
		db.collection('article').remove({"articleId":articleId},function(err,rs){
			if(err){
				console.log('daErr',err);
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

/*
* get Top Article
* Param:none
*/
exports.getTop = function(res){
	var queryDocument = function(db){
		db.collection('topArticle').find({}).toArray().then(function(rs){
			if(!rs){
				console.log('getTopErr');
			}else{
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"获取置顶文章成功!","top":rs[0]});
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
* change Top Article
* Param:aid img
*/
exports.changeTop = function(res,aid,img){
	var updateDocument = function(db){
		db.collection('article').find({"articleId":aid}).toArray().then(function(rs){
			if(rs){
				var r = rs[0];
				db.collection('topArticle').update({},{$set:{"articleId":r.articleId,"uId":r.uId,"author":r.author,"title":r.title,"vote":r.vote,"down":r.down,"tag":r.tag,"watchCount":r.watchCount,"topImg":img,"postDate":r.postDate}},function(){
					httpRes.sendSuccess_nc(res,{"code":"0","msg":"修改成功!","aid":r.articleId,"topimg":img});
					db.close();
				});
			}else{
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"修改失败!"});
				db.close();
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
* change Top Article
* Param:aid img
*/
exports.getHotFeed = function(res){
	var queryDocument = function(db){
		db.collection('article').find({}).sort({"vote":-1}).limit(5).toArray().then(function(rs){
			if(rs){
				console.log('rs',rs);
				httpRes.sendSuccess_nc(res,{"code":"0","msg":"查询热门文章成功!","hotfeed":rs});
				db.close();
			}else{
				httpRes.sendSuccess_nc(res,{"code":"1","msg":"获取热门文章失败!"});
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



