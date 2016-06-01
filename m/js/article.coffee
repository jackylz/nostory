;(()->
    $ ()->
        initRem = (callback)->
            #适配代码 px->rem
            funcRun = false;
            window.onresize = r;
            r = (resizeNum)->
                winW = window.innerWidth;
                document.getElementsByTagName("html")[0].style.fontSize = winW*0.15625+"px";
                if(winW > window.screen.width && resizeNum <= 10)
                    setTimeout ()->
                        r(++resizeNum)   
                    ,100
                else
                    document.getElementsByTagName("body")[0].style.opacity = 1;
                    if(callback&&!funcRun)
                        callback();
                        funcRun = true;
            setTimeout ()->
                r(0)
            ,100

        initRem ()->
            article.init();

    aid = window.location.search.replace('?','').split('=')[1];

    article =
        init:()->
            console.log 'article.init'
            @getArticle()
            @addComment()

        addComment:()->
            $('.add-comment').off('click').on 'click',()->
                comValue = $('.comment-area').val()
                if(comValue)
                    $.ajax
                        url:"http://m.nostory.cn/comments"
                        type:"post"
                        dataType:"json"
                        data:
                            'aid':aid
                            'oid':$.getCookie()[1]
                            'oName':$.getCookie()[0]
                            'content':comValue
                        success:(r)->
                            rd = r.data
                            if(rd.code == '0')
                                console.log rd
                                window.location = window.location
                            else
                                $.toast(rd.msg)

        getArticle:()->
            $.ajax
                url:"http://m.nostory.cn/getArticleByAid"
                type:"post"
                data:
                    "aid":aid
                dataType:"json"
                success:(r)->
                    rd = r.data
                    rs = rd.articleData
                    console.log rs;
                    if rd.code is '0'
                        $('.title').text rs.title
                        $('.content').html rs.content
                        $('.author').find('a').text "@"+rs.author
                        $('.vote').find('span').text rs.vote
                        $('.down').find('span').text rs.down
                        $('.time').text rs.postDate

                        if(rs.tag.length>0)
                            tmpHtml = ""
                            $.each rs.tag,(i,n)->
                                tmpHtml += """<div class="tag-name">#{n}</div>"""
                            $('.tag').append tmpHtml
                        else
                            $('.tag').remove()

                        if(rs.discusList.length == 0)
                            $('.c-none').show();
                        else
                            comHtml = ""
                            $.each rs.discusList,(i,n)->
                                comHtml += """<div class="c-box">
                                    <div class="c-box-desc">
                                        <div class="cbd index">\##{i+1}</div>
                                        <div class="cbd c-name"><a href="javascript:;" class="cbd-link">@#{n.ownerName}</a></div>
                                    </div>
                                    <div class="comment">#{n.content}</div>
                                    <div class="time">#{n.comDate}</div>
                                </div>"""
                            $('.comments').find('.desc').after comHtml
                            $('.comments .desc').find('.c-num').text """(#{$('.c-box').length})"""
                        








)();