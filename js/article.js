define('article',['require'],function(require){

	//引入模块
	var t = require('template');

	//函数主体
	aid = window.location.search.replace('?', '').split('=')[1];
  	
  	article = {
    	init:function() {
      		console.log('article.init');
      		this.getArticle();
      		return this.addComment();
    	},

    	addComment:function() {
        	$('.add-comment').off('click').on('click', function() {
        		var comValue;
        		comValue = $('.comment-area').val();
        		if (comValue) {
          			$.ajax({
	            		url: "http://www.nostory.cn/comments",
			            type: "post",
			            dataType: "json",
			            data: {
			              'aid': aid,
			              'oid': $.getCookie()[1],
			              'oName': $.getCookie()[0],
			              'content': comValue
			            },
	            		success: function(r) {
	              			var rd;
	              			rd = r.data;
	              			if (rd.code === '0') {
	                			console.log(rd);
	                			return window.location = window.location;
	              			} else {
	                			return $.toast(rd.msg);
	              			}
	            		}
          			});
        		}
      		});
    	},
    	getArticle: function() {
    		$.ajax({
		        url: "http://www.nostory.cn/getArticleByAid",
		        type: "post",
		        data: {
		          "aid": aid
		        },
		        dataType: "json",
		        success: function(r) {
		          	var comHtml, rd, rs, tmpHtml;
		          	rd = r.data;
		          	rs = rd.articleData;
		          	console.log(rs);
		          	if (rd.code === '0') {
		            	$('.title').text(rs.title);
		            	$('.content').html(rs.content);
		            	$('.author').find('a').text("@" + rs.author);
		            	$('.vote').find('span').text(rs.vote);
		            	$('.down').find('span').text(rs.down);
		            	$('.time').text(rs.postDate);
		            	if (rs.tag.length > 0) {
		              		tmpHtml = "";
		              		$.each(rs.tag, function(i, n) {
		                		return tmpHtml += "<div class=\"tag-name\">" + n + "</div>";
		              		});
		              		$('.tag').append(tmpHtml);
		            	} else {
		              		$('.tag').remove();
		            	}
		            	if (rs.discusList.length === 0) {
		              		return $('.c-none').show();
		            	} else {
		              		comHtml = "";
		              		$.each(rs.discusList, function(i, n) {
		                		return comHtml += "<div class=\"c-box\">\n    <div class=\"c-box-desc\">\n        <div class=\"cbd index\">\#" + (i + 1) + "</div>\n        <div class=\"cbd c-name\"><a href=\"javascript:;\" class=\"cbd-link\">@" + n.ownerName + "</a></div>\n    </div>\n    <div class=\"comment\">" + n.content + "</div>\n    <div class=\"time\">" + n.comDate + "</div>\n</div>";
		              		});
		              		$('.comments').find('.desc').after(comHtml);
		              		$('.comments .desc').find('.c-num').text("(" + ($('.c-box').length) + ")");
		           		}
		          	}
		        }
		    });
    	}
  	};
	
	//初始化函数
	init = function(){
		article.init();
	};

	//暴露模块
	return {
		init:init
	}
})