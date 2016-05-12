define('user',function(require){
    
    var t = require('template'),
        reg = require('reglog'),
        md5 = require('md5');

    var page = 1,
        PAGE_SIZE = 5;

    regex = { pass:/^[^\d\.][0-9|A-Z|a-z]{5,16}/ };
    tips = { 
        empty:"输入的密码不能为空",
        wrong:"输入的密码格式有误",
        diff:"输入的两次新密码不一致"
    };
    dataChange = {
        passWd : null,
        newPassWd : null
    };

    setPasswd = {
        init : function(){
            this.checkInput();
            this.ajaxEvent();
        },

        checkInput:function(){
            $('input').off('blur').on('blur',function(){
                self = $(this);
                if(self.val() == ""){
                    self.parent().find('span').remove();
                    self.parent().append("<span class=\"error\">"+ tips.empty +"</span>");
                }else if(!regex.pass.test(self.val())){
                    self.parent().find('span').remove();
                    self.parent().append("<span class=\"error\">"+ tips.wrong +"</span>");
                }else if((self.attr('id')=='newPassWd'|| self.attr('id')=='reNewPassWd') && $('#newPassWd').val()!=$('#reNewPassWd').val()){
                    self.parent().find('span').remove();
                    self.parent().append("<span class=\"error\">"+ tips.diff +"</span>");
                }else{
                    $('.error').remove();
                    dataChange.passWd = $('#passWd').val();
                    dataChange.newPassWd = $('#newPassWd').val();
                }
            });
        },

        ajaxEvent:function(){
            $('.change-passwd').off('click').on('click',function(){
                $('input').blur();
                if($('.error').index() == -1){
                    $.ajax({
                        url:"http://www.nostory.cn/changePassWd",
                        type:"POST",
                        dataType:"json",
                        data:{
                            "uId":$('.set-password').attr('data-id'),
                            "passWd":md5.md5(dataChange.passWd),
                            "newPassWd":md5.md5(dataChange.newPassWd)
                        },
                        success:function(r){
                            if(r.data.code == "0"){
                                $.toast(r.data.msg);
                                setTimeout(function(){
                                    $('.log-out-btn').click();
                                },1000)
                            }else if(r.data.code == "1"){
                                $.toast(r.data.msg);
                            }
                        }
                    });
                }else{
                    $.toast("请正确输入密码");
                }
            })
            
        }
    };

    getInfo = {
        init:function(){
            this.getUserInfo();
            this.getArticleByUid();
            this.getRelation();
        },

        getUserInfo:function(){
            var uid = window.location.search.replace('?','').split('=')[1];
            $.ajax({
                url:"/getUserInfo",
                type:"post",
                dataType:"json",
                data:{
                    "uId":uid
                },
                success:function(r){
                    var rs = r.data;
                    if(rs.code == "0"){
                        var rd = rs.dataList;
                        var rc = rs.count;
                        console.log(rc);
                        $('.user-name-span').text(rd.nickName);
                        rd.area==""?$('.area').text("未填写"):$('.area').text(rd.area);
                        rd.avatarUrl==""?null:$('.avatar').css('background-image','url('+rd.avatarUrl+')');
                        rd.college==""?$('.college').text("未填写"):$('.college').text(rd.college);
                        rd.company==""?$('.company').text("未填写"):$('.company').text(rd.company);
                        rd.eMail==""?$('.email').text("未填写"):$('.email').text(rd.eMail);
                        rd.hometown==""?$('.hometown').text("未填写"):$('.hometown').text(rd.hometown);
                        rd.wechat==""?$('.wechat').text("未填写"):$('.wechat').text(rd.wechat);
                        rd.location==""?$('.location').text("未填写"):$('.location').text(rd.location);
                        rd.major==""?$('.major').text("未填写"):$('.major').text(rd.major);
                        rd.jobTitle==""?$('.job-title').text("未填写"):$('.job-title').text(rd.jobTitle);

                        $('.l-article').find('.data-value').text(rc.articleCount);
                        $('.l-fellowed').find('.data-value').text(rc.fellowedCount);
                        $('.l-fellowing').find('.data-value').text(rc.fellowingCount);

                    }
                }
            });
        },

        getArticleByUid:function(){
            var uid = window.location.search.replace('?','').split('=')[1];
            $.ajax({
                url:"http://www.nostory.cn/getArticleByUid",
                type:"post",
                dataType:"json",
                data:{
                    "uId":uid,
                    "page":page,
                    "pageSize":PAGE_SIZE
                },
                success:function(r){
                    var rs = r.data;
                    var rd = rs.articleList;
                    var len = rd.length;
                    console.log(rd);
                    if(rs.code=="0"&&len>0){
                        var strHtml = "";
                        $.each(rd,function(i,n){
                            var rawCut = n.raw.length>120 ? (n.raw.substr(0,120)+'...') : n.raw;
                            strHtml += "<div class=\"li-box\">\
                                            <div class=\"value-index\">\
                                                <span class=\"value-num\">"+ n.vote +"</span>\
                                                <span class=\"value-desc\">赞同</span>\
                                            </div>\
                                            <div class=\"article-box\">\
                                                <a href=\"http://www.nosotry.cn/article.html?aid="+ n.articleId +"\" class=\"article-title\">"+ n.title +"</a>\
                                                <div class=\"article-desc\"><p>"+ rawCut +"</p></div>\
                                            </div>\
                                        </div>"
                        });
                        $('.user-load-more').before(strHtml);
                        getInfo.loadMore();
                        page++;
                    }else if(len==0){
                        $('.user-load-more').text('没有更多文章了...');
                        $.toast("没有更多文章了...");
                    }
                }
            });
        },

        loadMore:function(){
            $('.user-load-more').off('click').on('click',function(){
                getInfo.getArticleByUid();
            })
        },

        getRelation:function(){
            var uid = $.getCookie()[1];
            var _uid = window.location.search.replace('?','').split('=')[1];
            console.log(uid);
            console.log(_uid);
            if(uid != _uid){
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
                        if(r.dataCode == 0 || r.dataCode == 2){
                            var strHtml = "<div class=\"relation-btn to-fellow\" data-me=\""+ uid +"\" data-who=\""+ _uid +"\">关注</div>";
                            $('.user-name').append(strHtml);
                            getInfo.fellowEvent(uid,_uid,r.dataCode);
                        }else if(r.dataCode == 1){
                            var strHtml = "<div class=\"relation-btn has-fellowed\" data-me=\""+ uid +"\" data-who=\""+ _uid +"\">取消关注</div>";
                            $('.user-name').append(strHtml);
                            getInfo.unfellowEvent(uid,_uid);
                        }else if(r.dataCode == 3){
                            var strHtml = "<div class=\"relation-btn relation-friends\" data-me=\""+ uid +"\" data-who=\""+ _uid +"\">好友</div>";
                            $('.user-name').append(strHtml);
                            getInfo.friendEvent(uid,_uid);
                        } 
                    }
                });
            }
        },

        fellowEvent:function(uid,_uid,code){
            $('.to-fellow').off('click').on('click',function(){
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
                            $('.relation-btn').remove();
                            if(code == 0){
                                var strHtml = "<div class=\"relation-btn has-fellowed\" data-me=\""+ uid +"\" data-who=\""+ _uid +"\">取消关注</div>";
                                $('.user-name').append(strHtml);
                                getInfo.unfellowEvent(uid,_uid);
                            }else if(code == 2){
                                var strHtml = "<div class=\"relation-btn relation-friends\" data-me=\""+ uid +"\" data-who=\""+ _uid +"\">好友</div>";
                                $('.user-name').append(strHtml);
                                getInfo.friendEvent(uid,_uid);
                            }
                                
                        }
                    }
                });
            });
        },

        unfellowEvent:function(uid,_uid){
            $('.has-fellowed').off('click').on('click',function(){
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
                            $('.relation-btn').remove();
                            var strHtml = "<div class=\"relation-btn to-fellow\" data-me=\""+ uid +"\" data-who=\""+ _uid +"\">关注</div>";
                            $('.user-name').append(strHtml);
                            getInfo.fellowEvent(); 
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
                            $('.relation-btn').remove();
                            var strHtml = "<div class=\"relation-btn to-fellow\" data-me=\""+ uid +"\" data-who=\""+ _uid +"\">关注</div>";
                            $('.user-name').append(strHtml);
                            getInfo.fellowEvent(); 
                        }
                    }
                });
            });
        },
    };

    init = function(){
        var cookieTmp = $.getCookie();
        reg.regFun.addUserTab(cookieTmp[1],cookieTmp[0]);
        if(window.location.pathname == '/user/setPwd.html'){
            $('.set-password').attr('data-id',cookieTmp[1]);
            setPasswd.init();
        }
        if(window.location.pathname == '/user/info.html'){
            getInfo.init();
        }
            
    };

    return {
        init:init,
        setPasswd:setPasswd,
        getInfo:getInfo
    }
});