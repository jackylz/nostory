;(function($){

	$(function(){
		function initRem(callback){
	        //适配代码 px->rem
	        var funcRun = false;
	        window.onresize = r;
	        function r(resizeNum){
	            var winW = window.innerWidth;
	            document.getElementsByTagName("html")[0].style.fontSize = winW*0.15625+"px";
	            if(winW > window.screen.width && resizeNum <= 10) {
	                setTimeout(function(){
	                    r(++resizeNum)   
	                }, 100);
	            }
	            else {
	                document.getElementsByTagName("body")[0].style.opacity = 1;
	                if(callback&&!funcRun){
	                    callback();
	                    funcRun = true;
	                } 
	            }
	        }
	        setTimeout(function(){r(0)}, 100);
	    }

	    initRem(function(){
	    	index.init();
	    })
	});

	var page = 1,
		PAGE_SIZE = 5;

	index = {
		init:function(){
			console.log('index init..');
			this.getArticleList();
			this.getTopArticle();
			this.loadMore();
		},

		getTopArticle:function(){
			$.ajax({
				url:"http://m.nostory.cn/getTop",
				type:"post",
				dataType:"json",
				success:function(r){
					var rd = r.data;
					var rs = rd.top;
					if(rd.code == '0'){
						console.log(rs);
						var tmpHtml = "<a href=\"http://m.nostory.cn/article.html?aid="+rs.articleId+"\" class=\"post-top\" target=\"_blank\">\
			                <img width=\"100%\" src=\""+ rs.topImg +"\" alt=\""+ rs.title +"\">\
			                <div class=\"news-title\">"+ rs.title +"</div>\
			                <div class=\"info-area\">\
			                    <span class=\"post-time\">"+ rs.postDate +"</span>\
			                    <span class=\"post-author\">@"+ rs.author +"</span>\
			                    <div class=\"top-place\">置顶</div>\
			                </div>\
			            </a>";

			            $('.wrap').prepend(tmpHtml);
						// var tmpHtml = "<div class=\"now-top\">\
						// 		<div class=\"n-t n-t-article\">\
						// 			原置顶主题文章ID : <span class=\"new-aid\">"+ rs.top.articleId +"</span>\
						// 		</div>\
						// 		<div class=\"n-t n-t-article\">\
						// 			原置顶主题配图URL: <span class=\"new-img\">"+ rs.top.topImg +"</span>\
						// 		</div>\
						// 	</div>\
						// 	<div class=\"input-new\">\
						// 		<label>新置顶主题文章ID : </label><input type=\"text\" class=\"id-input\" maxlength=\"5\" />\
						// 	</div>\
						// 	<div class=\"input-new\">\
						// 		<label>新置顶主题配图URL: </label><input type=\"text\" class=\"img-input\" />\
						// 	</div>\
						// 	<a href=\"javascript:;\" class=\"top-confirm\">确认修改</a>\
						// </div>";

						// $('.topArea').append(tmpHtml);
						// tmpHtml = "";
					}
				}
			})
		},

		getArticleList:function(){
			$.ajax({
				url:"http://m.nostory.cn/getArticle",
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
							var tagHtml = "";
							if(n.tag.length > 0){
								tagHtml = "<div class=\"top-place\">"+ n.tag[0] +"</div>";
							}else{
								tagHtml = "";
							}
							strHtml += "<div class=\"post-box\">\
				                <a href=\"http://m.nostory.cn/article.html?aid="+n.articleId+"\" class=\"title\" target=\"_blank\">"+ n.title +"</a>\
				                <div class=\"info-area\">\
				                    <span class=\"post-time\">"+ n.postDate +"</span>\
				                    <span class=\"post-author\">@"+ n.author +"</span>"+ tagHtml+"\
				                </div>\
				            </div>";
						});
						$('.load-more').before(strHtml);
						page++;
					}else if(len == 0){
						$('.load-more').text('没有更多文章了...');
					}
				}
			})
		},
		loadMore:function(){
			$('.load-more').off('click').on('click',function(){
				index.getArticleList();
			})
		},
	};

})(jQuery)