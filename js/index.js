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
								<h1>"+ n.title +"</h1>\
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

		getCookieStatus:function(){
			var cookieTmp = $.getCookie();
			reg.regFun.addUserTab(cookieTmp[1],cookieTmp[0]);
		}
	};

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
		}
			
		
		if(location.href.indexOf('publisher')!= -1){
			p.init();
		};

		if(window.location.pathname == '/'){
			funList.getUserCard();		
		}

	};

	return {
		init:init
	};
});




