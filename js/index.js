define('index',['require'],function(require) {

	var t = require('template');
	var reg = require('reglog');
	var p = require('publish');

	var page = 1,
		PAGE_SIZE = 5;

	ele = {
		signObj:$('.sign-log li a').eq(0),
		logObj:$('.sign-log li a').eq(1),
		sunRise:$('.sunrise'),
		closeIco:$('.close-ico')
	};

	funList = {
		sunRise:function(obj,callback){
			$.each(obj,function(i,n){
				$(n).on('click',function(){
					ele.sunRise.addClass('sunny');
					var cName = $(this).attr('class');
					$('body').append( cName=='reg-btn' ? t.tpl.reg : t.tpl.log);
					setTimeout(function(){
						$('.box').addClass('trans')
						funList.sunSet(ele.closeIco);
					},100)
					reg.init();
					funList.sunSet(ele.sunRise);
					callback.call($('.close-ico'));
	 			});
			});
		},
		sunSet:function(obj){
			$(obj).on('click',function(){
				ele.sunRise.removeClass('sunny');
				$('.box').removeClass('trans');
				setTimeout(function(){
					$('.box').remove();
				},100)
			});
		},

		getUserCard:function(){
			$.ajax({
				url:"/getUserInfo",
				type:"post",
				dataType:"json",
				data:{
					"uId":$.getCookie()[1]
				},
				success:function(r){
					var rs = r.data;
					if(rs.code == "0"){
						$('.user-name').find('a').text(rs.dataList.nickName);
						$('.user-name').find('a').attr("href","http://www.nostory.cn/user/info.html?userId="+rs.dataList.uId);
						$('.user-id').find('span').text(rs.dataList.uId);
						if(rs.dataList.userTag.length > 0){
							$.each(rs.dataList.userTag,function(i,n){
								$('.user-tag').append("<p class=\"tag\">#"+ n+"</p>");
							});
						}

						$('.fellowing').find('.data').text(rs.count.fellowingCount);
						$('.fellowed').find('.data').text(rs.count.fellowedCount);
						$('.article-count').find('.data').text(rs.count.articleCount);

						$('.user-info-list').find('a.fellowing').attr("href","http://www.nostory.cn/user/info.html?userId="+rs.dataList.uId+"#fellowing");
						$('.user-info-list').find('a.fellowed').attr("href","http://www.nostory.cn/user/info.html?userId="+rs.dataList.uId+"#fellowed");
						$('.user-info-list').find('a.article-count').attr("href","http://www.nostory.cn/user/info.html?userId="+rs.dataList.uId);
					}
				}
			});
		},

		getRecUser:function(){
			$.ajax({
				url:"/getRecUser",
				type:"post",
				dataType:"json",
				data:{
					"uid":$.getCookie()[1]
				},
				success:function(r){
					var rd = r.data;
					var rs = rd.friendsList;
					var html = "";
					if(rd.code=="0"){
						$.each(rs,function(i,n){
							if(i<2){
								html += "<div class=\"rec-friends\">\
								<a href=\"http://www.nostory.cn/user/info.html?userId="+ n.uId +"\" class=\"rf-name\">@"+ n.nickName +"</a>\
								<a href=\"javascript:;\" class=\"follow-btn to-fellow\" data-id=\""+ n.uId +"\">关注</a>\
							</div>";
							}
						});
						
						$('.n-right-bot').append(html);
						funList.fellowEvent($.getCookie()[1],$('.to-fellow').attr("data-id"));
					}
				}
			});
		},

		getRelation:function(uid,_uid){
			var dataCode = "";
			$.ajax({
                url:"http://www.nostory.cn/getRelation",
                type:"post",
                dataType:"json",
                data:{
                    "uId":uid,
                    "_uId":_uid
                },
                success:function(rs){
                    var r = rs.data;
                    console.log(r.dataCode);
                    dataCode = r.dataCode;
                    // if(r.dataCode == 0 || r.dataCode == 2){
                    //     $('.follow-btn').attr('data-code',r.dataCode);
                    //     funList.fellowEvent(uid,_uid,r.dataCode);
                    // }else if(r.dataCode == 1){
                    //     $('.follow-btn').attr('data-code',r.dataCode);
                    //     funList.unfellowEvent(uid,_uid);
                    // }else if(r.dataCode == 3){
                    //     $('.follow-btn').attr('data-code',r.dataCode);
                    //     funList.friendEvent(uid,_uid);
                    // } 
                }
            });
            return dataCode;
		},

		fellowEvent:function(uid,_uid){
            $('.to-fellow').off('click').on('click',function(){
            	var code = funList.getRelation(uid,_uid);
            	var self = $(this);
                $.ajax({
                    url:"http://www.nostory.cn/fellow",
                    type:"post",
                    dataType:"json",
                    data:{
                        "uId":uid,
                        "_uId":_uid
                    },
                    success:function(rs){
                        var r = rs.data;
                        if(r.code == "0"){
                        	console.log('dataCode',code);
                            if(code == 0){
                            	self.text('取关');
                                self.addClass('has-fellowed').removeClass('to-fellow');
                                funList.unfellowEvent(uid,_uid);
                            }else if(code == 2){
                                self.text('好友');
                                self.addClass('relation-friends').removeClass('to-fellow');
                                funList.friendEvent(uid,_uid);
                            }  
                        }
                    }
                });
            });
        },

        unfellowEvent:function(uid,_uid){
            $('.has-fellowed').off('click').on('click',function(){
            	var self = $(this);
                $.ajax({
                    url:"http://www.nostory.cn/unfellow",
                    type:"post",
                    dataType:"json",
                    data:{
                        "uId":uid,
                        "_uId":_uid
                    },
                    success:function(rs){
                        var r = rs.data;
                        if(r.code == "0"){
                            self.text('关注');
                            self.addClass('to-fellow').removeClass('has-fellowed');
                        	funList.fellowEvent(uid,_uid);
                        }
                    }
                });
            });
        },

        friendEvent:function(uid,_uid){
            $('.relation-friends').off('click').on('click',function(){
                $.ajax({
                    url:"http://www.nostory.cn/unfellow",
                    type:"post",
                    dataType:"json",
                    data:{
                        "uId":uid,
                        "_uId":_uid
                    },
                    success:function(rs){
                        var r = rs.data;
                        if(r.code == "0"){
                            self.text('关注');
                            self.addClass('to-fellow').removeClass('relation-friends');
                        	funList.fellowEvent(uid,_uid);
                        }
                    }
                });
            });
        },

		getArticleList:function(){
			$.ajax({
				url:"http://www.nostory.cn/getArticle",
				type:"post",
				dataType:"json",
				data:{
					"uId":$.getCookie()[1],
					"page":page,
					"pageSize":PAGE_SIZE
				},
				success:function(rs){
					var r = rs.data;
					var len = r.articleList.length;
					var strHtml = "";
					if(r.code == "0"&&len>0){
						$.each(r.articleList,function(i,n){
							var contentTmp = n.content.length<120?n.content:(n.raw.substr(0,120)+'...');
							var tagHtml = "";
							if(n.tag.length > 0){
								$.each(n.tag,function(i,n){
									tagHtml += "<li><a href=\"javascript:;\">#"+ n +"</a></li>";
								});
							}else{
								tagHtml = "";
							}
							console.log("ctmp",contentTmp);
							strHtml += "<div class=\"n-left-wrap\">\
								<a href=\"http://www.nostory.cn/article.html?aid="+ n.articleId +"\" target=\"_blank\"><h1 style=\"width:666px\">"+ n.title +"</h1>\
								<div class=\"info clearfix\">\
									<div class=\"sub-info author-name\">作者：<a href=\"http://www.nostory.cn/user/info.html?userId="+ n.uId +"\">@"+ n.author +"</a></div>\
									<div class=\"sub-info publish-time\">发表于：<span>"+ n.postDate +"</span></div>\
									<ul class=\"sub-info tag-name clearfix\">"+ tagHtml +"</ul>\
									<!--<li><a href=\"javascript:;\">#杂谈</a></li>\
										<li><a href=\"javascript:;\">#散文</a></li>-->\
								</div>\
								<div class=\"content shorten\"><p>"+ contentTmp +"</p></div>\
								<div class=\"content allText\" style=\"display:none;\">"+n.content +"</div>\
								<div class=\"vote-area\" data-id=\""+ n.articleId +"\">\
									<div class=\"vote-box vote-up\">\
										<i></i>\
										<span class=\"up-number\">"+ n.vote +"</span>\
									</div>\
									<div class=\"vote-box vote-down\">\
										<span class=\"down-number\">"+ n.down +"</span>\
										<i></i>\
									</div>\
								</div>\
								<div class=\"show-btn\">展开</div></div>";
							
						});
						$('.load-more').before(strHtml);
						funList.showEvent();
						funList.voteEvent();
						page++;
					}else if(len == 0){
						$('.load-more').text('没有更多文章了...');
						$.toast("没有更多文章了...")
					}
				}
			})
		},

		showEvent:function(){
			$('.show-btn').off('click').on('click',function(){
				var self = $(this);
				if(self.text()=="展开"){
					self.parent().find('.shorten').hide();
					self.parent().find('.allText').show();
					self.text("收起");
				}else{
					self.parent().find('.shorten').show();
					self.parent().find('.allText').hide();
					self.text("展开");
				}
			});
		},

		loadMore:function(){
			$('.load-more').off('click').on('click',function(){
				funList.getArticleList();
			})
		},

		voteEvent:function(){
			$('.vote-up').off('click').on('click',function(){
				var self = $(this);
				var aId = self.parent().data('id');
				$.ajax({
					url:"http://www.nostory.cn/vote",
					type:"post",
					dataType:"json",
					data:{"articleId":aId},
					success:function(r){
						var rs = r.data;
						console.log(rs);
						if(rs.code == "0"){
							self.find('.up-number').text(rs.newVote);
						}
					}
				});
			});
			$('.vote-down').off('click').on('click',function(){
				var self = $(this);
				var aId = self.parent().data('id');
				$.ajax({
					url:"http://www.nostory.cn/down",
					type:"post",
					dataType:"json",
					data:{"articleId":aId},
					success:function(r){
						var rs = r.data;
						console.log(rs);
						if(rs.code == "0"){
							self.find('.down-number').text(rs.newDown);
						}
					}
				});
			});
		},

		getHotFeed:function(){
			$.ajax({
				url:"http://www.nostory.cn/getHotFeed",
				type:"post",
				dataType:"json",
				success:function(r){
					var rs = r.data;
					var tmpHtml = "";
					if(rs.code == '0'){
						$.each(rs.hotfeed,function(i,n){
							tmpHtml += "<div class=\"article-list\">\
								<a href=\"http://www.nostory.cn/article.html?aid="+ n.articleId +"\" class=\"a-title\" target=\"_blank\">"+ n.title +"</a>\
								<div class=\"read-author\">作者：<span>"+ n.author +"</span></div>\
								<div class=\"read-num\">赞同数：<span>"+ n.vote +"</span></div>\
							</div>";
						});
						$('.link-wrap').append(tmpHtml);
						$('.article-list').eq(4).addClass('last');
					}else{
						$.toast(rs.msg);
					}
				}
			})
		},

		getCookieStatus:function(){
			var cookieTmp = $.getCookie();
			reg.regFun.addUserTab(cookieTmp[1],cookieTmp[0]);
		}
	};

	m = {
		init:function(){
			this.getAdmin();
		},

		getAdmin:function(){
			var name = window.location.search.replace("?","").split("&")[0].split("=")[1];
			$.ajax({
				url:"http://www.nostory.cn/getAdmin",
				type:"post",
				data:{"name":name},
				dataType:"json",
				success:function(r){
					var rs = r.data;
					console.log(rs.role);
					$('.role-text').text(rs.role);
					if(rs.role=="manager"){
						$('.for-admin').hide();
						$('.for-manage').show();
						$('.list').append("<div class=\"topArea\"></div>");
						m.topTabAjax();
					}else{
						m.tabChange(function(){
							$('.u-m').click();
						});
					}
				}
			});
		},

		tabChange:function(callback){
			$('.for-admin').find('li').off("click").on("click",function(){
				var self = $(this);
				var uHtml = "<table border=\"1\">\
					<thead>\
						<tr>\
							<th>uid</th>\
							<th>帐号名</th>\
							<th>用户名</th>\
							<th>注册时间</th>\
							<th>操作</th>\
						</tr>\
					</thead>\
					<tbody>\
					</tbody>\
				</table>";
				var aHtml = "<table border=\"1\">\
					<thead>\
						<tr>\
							<th>aid</th>\
							<th>文章标题</th>\
							<th>作者</th>\
							<th>发布时间</th>\
							<th>操作</th>\
						</tr>\
					</thead>\
					<tbody>\
					</tbody>\
				</table>";
				var tHtml = "<div class=\"topArea\"></div>";

				if(!self.hasClass('active')){
					var tmpHtml = "";
					self.parent().find('li').removeClass('active');
					self.addClass('active');
					self.parents('.tab-content').find('.list').find('table,.topArea').remove();
					if(self.index() == 0){
						self.parents('.tab-content').find('.list').append(uHtml);
						m.userTabAjax();
					}else if(self.index() == 1){
						self.parents('.tab-content').find('.list').append(aHtml);
						m.articleTabAjax();
					}else if(self.index() == 2){
						self.parents('.tab-content').find('.list').append(tHtml);
						m.topTabAjax();
					}
				}
			})

			callback();
		},

		userTabAjax:function(){
			$.ajax({
				url:"http://www.nostory.cn/getUserList",
				type:"post",
				dataType:"json",
				success:function(r){
					var rs = r.data;
					if(rs.code == '0'){
						var tmpHtml = "";
						$('tbody tr').remove();
						$.each(rs.userList,function(i,n){
							tmpHtml += "<tr>\
								<td>"+n.uId+"</td>\
								<td>"+n.eMail+"</td>\
								<td>"+ n.nickName +"</td>\
								<td>"+ n.regDate +"</td>\
								<td><a href=\"javascript:;\" class=\"delete-btn user-delete\" data-id=\""+ n.uId +"\">删除</a></td>\
							</tr>"

							$('tbody').append(tmpHtml);
							m.userDelete();
							tmpHtml = "";
						})
					}
				}
			});
		},
		articleTabAjax:function(){
			$.ajax({
				url:"http://www.nostory.cn/getArticleList",
				type:"post",
				dataType:"json",
				success:function(r){
					var rs = r.data;
					if(rs.code == '0'){
						var tmpHtml = "";
						$('tbody tr').remove();
						$.each(rs.articleList,function(i,n){
							tmpHtml += "<tr>\
								<td>"+n.articleId+"</td>\
								<td><a href=\"http://www.nostory.cn/article.html?aid="+ n.articleId +"\" class=\"a-link\" target=\"_blank\">"+n.title+"</td>\
								<td>"+ n.author +"</td>\
								<td>"+ n.postDate +"</td>\
								<td><a href=\"javascript:;\" class=\"delete-btn article-delete\" data-id=\""+ n.articleId +"\">删除</a></td>\
							</tr>"

							$('tbody').append(tmpHtml);
							m.articleDelete();
							tmpHtml = "";
						})
					}
				}
			});
		},
		topTabAjax:function(){
			$.ajax({
				url:"http://www.nostory.cn/getTop",
				type:"post",
				dataType:"json",
				success:function(r){
					var rs = r.data;
					if(rs.code == '0'){
						var tmpHtml = "<div class=\"now-top\">\
								<div class=\"n-t n-t-article\">\
									原置顶主题文章ID : <span class=\"new-aid\">"+ rs.top.articleId +"</span>\
								</div>\
								<div class=\"n-t n-t-article\">\
									原置顶主题配图URL: <span class=\"new-img\">"+ rs.top.topImg +"</span>\
								</div>\
							</div>\
							<div class=\"input-new\">\
								<label>新置顶主题文章ID : </label><input type=\"text\" class=\"id-input\" maxlength=\"5\" />\
							</div>\
							<div class=\"input-new\">\
								<label>新置顶主题配图URL: </label><input type=\"text\" class=\"img-input\" />\
							</div>\
							<a href=\"javascript:;\" class=\"top-confirm\">确认修改</a>\
						</div>";

						$('.topArea').append(tmpHtml);
						tmpHtml = "";
						m.topChange();

					}
				}
			})
		},
		topChange:function(){
			$('.top-confirm').off('click').on('click',function(){
				var aid = $('.id-input').val();
				var img = $('.img-input').val();
				if(!aid || !img){
					$.toast('输入不能为空');
				}else{
					$.ajax({
						url:"http://www.nostory.cn/changeTop",
						type:"post",
						data:{"aid":aid,"img":img},
						dataType:"json",
						success:function(r){
							var rs = r.data;
							$.toast(rs.msg);
							m.userTabAjax();
							setTimeout(function(){
								window.location = window.location;
							},1000)
						}
					})
				}
			});
		},

		userDelete:function(){
			$('.user-delete').on('click',function(){
				var self = $(this);
				var uid = self.attr("data-id");
				$.ajax({
					url:"http://www.nostory.cn/deleteUser",
					type:"post",
					data:{"uid":uid},
					dataType:"json",
					success:function(r){
						var rs = r.data;
						$.toast(rs.msg);
						m.userTabAjax();
					}
				})
			})
		},

		articleDelete:function(){
			$('.article-delete').on('click',function(){
				var self = $(this);
				var aid = self.attr("data-id");
				$.ajax({
					url:"http://www.nostory.cn/deleteArticle",
					type:"post",
					data:{"aid":aid},
					dataType:"json",
					success:function(r){
						var rs = r.data;
						$.toast(rs.msg);
						m.articleTabAjax();
					}
				})
			})
		},
	};

	sa = {
		init:function(){
			this.getUserInfo();
			this.showBtn();
			this.changeBtnEvent();
			this.getCookieStatus();
			this.confirmEvent();
			this.cancelEvent();
		},

		getUserInfo:function(){
			$.ajax({
				url:"/getUserInfo",
				type:"post",
				dataType:"json",
				data:{
					"uId":$.getCookie()[1]
				},
				success:function(r){
					var rs = r.data;
					var rd = rs.dataList;
					if(rs.code == "0"){
						$('.username').children('span').text(rd.nickName);
						$('.area').children('span').text(rd.area||"未填写");
						$('.company').children('span').text(rd.company||"未填写");
						$('.job-title').children('span').text(rd.jobTitle||"未填写");
						$('.college').children('span').text(rd.college||"未填写");
						$('.major').children('span').text(rd.major||"未填写");
						$('.wechat').children('span').text(rd.wechat||"未填写");
						$('.email').children('span').text(rd.eMail);
						$('.location').children('span').text(rd.location||"未填写");
						$('.hometown').children('span').text(rd.hometown||"未填写");
						var tmpUrl = "background:url("+ rd.avatarUrl +");background-size:100px 100px;";
						$('.avatar').attr('style',tmpUrl);
						$('.privacy-setting').attr('data-id',rd.privacy);
						if(rd.privacy == '0'){
							$('.privacy-setting').removeClass('forSelf').addClass('forAll').text('公开');
							sa.changePrivacy();
						}else if(rd.privacy == '1'){
							$('.privacy-setting').removeClass('forAll').addClass('forSelf').text('保密');
							sa.changePrivacy();
						}
					}
				}
			});
		},

		changePrivacy:function(){
			$('.forAll').off('click').on('click',function(){
				$.ajax({
					url:"http://www.nostory.cn/changePrivacy",
					type:"post",
					data:{
						"uid":$.getCookie()[1],
						"status":"1"
					},
					dataType:"json",
					success:function(r){
						var rs = r.data;
						if(rs.code == '0'){
							$('.privacy-setting').removeClass('forAll').addClass('forSelf').text('保密');
							sa.changePrivacy();
						}else{
							$.toast(rs.msg);
						}
					}
				})
			});
			$('.forSelf').off('click').on('click',function(){
				$.ajax({
					url:"http://www.nostory.cn/changePrivacy",
					type:"post",
					data:{
						"uid":$.getCookie()[1],
						"status":"0"
					},
					dataType:"json",
					success:function(r){
						var rs = r.data;
						if(rs.code == '0'){
							$('.privacy-setting').removeClass('forSelf').addClass('forAll').text('公开');
							sa.changePrivacy();
						}else{
							$.toast(rs.msg);
						}
					}
				})
			});
		},

		showBtn:function(){
			$('.u-data:not(.email)').on('mouseover',function(){
				var self = $(this);
				self.find('.change-btn').css('display','inline-block');
			})
			$('.u-data:not(.email)').on('mouseout',function(){
				var self = $(this);
				self.find('.change-btn').hide();
			})
		},

		changeBtnEvent:function(){
			$('.change-btn').off('click').on('click',function(){
				var self = $(this);
				self.find('.change-area').show();
				self.find('input').focus();
			})
		},

		confirmEvent:function(){
			$('.confirm-change').off('click').on('click',function(){
				var self = $(this);
				var inputText = self.parent().find('input').val();
				var item = self.parents('.u-data').attr('data-code');
				var uid = $.getCookie()[1];
				if(inputText){
					$.ajax({
						url:"http://www.nostory.cn/changeUserInfo",
						type:"post",
						data:{
							"uid":uid,
							"item":item,
							"value":inputText
						},
						dataType:"json",
						success:function(r){
							var rs = r.data;
							window.location = window.location;
						}
					})
				}
			})
		},
		cancelEvent:function(){
			$('.cancle-change').off('click').on('click',function(){
				$('.change-area').hide();
				$('.change-btn').hide();
			})
		},
		getCookieStatus:function(){
			var cookieTmp = $.getCookie();
			reg.regFun.addUserTab(cookieTmp[1],cookieTmp[0]);
		}
	} 
	rightFixed = function(){
		$('.container').bind('scroll',function(){
			if($(this).scrollTop()>=12){
				$('.n-right').addClass('right-fixed');
			}else if($(this).scrollTop()<12){
				$('.n-right').removeClass('right-fixed');
			}
		});
	};

	init = function(){

		funList.sunRise([ele.signObj,ele.logObj],function(){
			funList.sunSet(this);
		});

		if(window.location.pathname == "/"){
			rightFixed();
			funList.getCookieStatus();
			funList.getArticleList();
			funList.loadMore();
			funList.getUserCard();
			funList.getHotFeed();
			funList.getRecUser();
		}
			
		if(location.href.indexOf('setAccount')!=-1){
			sa.init();
			$('.user-nav').find('li').eq(0).find('a').attr('href','http://www.nostory.cn/user/info.html?userId='+$.getCookie()[1])
		}

		if(location.href.indexOf('publisher')!= -1){
			p.init();
		};

		if(location.href.indexOf('manage')!= -1){
			m.init();
		};

	};

	return {
		init:init
	};
});




