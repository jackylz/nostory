define('publish',function(require){

    editText = {
        title:null,
        raw:null,
        real:null,
        tag:""
    }

    fun = {

        postBtnEvent : function(){
            $('.add-btn').on('click',function(){
                fun.getRealContent();
                fun.getTagName();
                fun.getRawContent();
                if(!editText.real){
                    $.toast('请输入文章内容');
                }else if(editText.raw && editText.raw.length<= 10){
                    $.toast('文章内容需超过10个字符');
                }else{
                    $.ajax({
                        url:"http://www.nostory.cn/addPost",
                        type:"post",
                        dataType:"json",
                        data:{
                            uId:$.getCookie()[1],
                            title:$('.title-area').find('input').val()||'无题',
                            tag:editText.tag,
                            content:editText.real,
                            raw:editText.raw
                        },
                        success:function(r){
                            if(r.data.code == '0'){
                                $.toast('发表成功');
                                setTimeout(function(){
                                   // window.location = 'http://www.nostory.cn'; 
                                },1000);
                                
                            }
                        }
                    });
                }
                
            });
        },

        addTag:function(){
            $('.tag-add').on('click',function(){
                var self = $(this);
                var html = "<div class=\"add-tag-area\"><input type=\"text\" class=\"tag-input\" placeholder=\"请输入标签\" maxlength=\"4\"／><span class=\"tag-confirm\">确认</span><span class=\"tag-cancel\">取消</span>";
                if($('.tag-name').length < 4){
                    if(self.parent().find('.add-tag-area').index() != -1){
                        self.parent().find('.add-tag-area').remove();
                    }else{
                        self.parent().append(html);
                        var $ti = $('.tag-input');
                        var $confirm = $('.tag-confirm');
                        var $cancel = $('.tag-cancel');
                        $ti.focus();
                        $confirm.on('click',function(){
                            var tagValue = $ti.val();
                            var tagHtmlHead = "<div class=\"tag tag-name\">#"
                            var tagHtmlTail = "</div>"
                            self.parent().find('.add-tag-area').remove();
                            
                            if(self.parent().find('.tag-name').index() != -1){
                                $('.tag-name').eq($('.tag-name').length-1).after(tagHtmlHead + tagValue + tagHtmlTail);
                                fun.deleteTag();
                            }else{
                                $('.tag-add').before(tagHtmlHead + tagValue + tagHtmlTail);
                                fun.deleteTag();
                            }
                        }); 
                        $cancel.on('click',function(){
                            self.parent().find('.add-tag-area').remove();
                        });
                    }
                }else{
                    $.toast('文章最多可添加4个标签');
                }
            });
        },

        deleteTag:function(){
            $('.tag-name').off('click').on('click',function(){
                var self = $(this);
                self.remove();
            });
        },

        getTagName:function(){
            editText.tag = "";
            $.each($('.tag-name'),function(i,n){
                var tmp = $(n).text().replace('#','');
                editText.tag += tmp+"&";
            });
        },

        resetBtnEvent : function(){
            $('.reset-btn').on('click',function(){
                var activeEditor = tinymce.activeEditor;
                var editBody = activeEditor.getBody();
                $(editBody).text("");
                $('.char-count').find('span').text("0");
                editText.raw = null;
                editText.real = null;
            });
        }, 

        getRealContent : function(){
            editText.real = tinymce.activeEditor.getContent();
        },

        getRawContent : function(){
            var activeEditor = tinymce.activeEditor;
            var editBody = activeEditor.getBody();
            editText.raw = $(editBody).text();
            console.log('et:',$(editBody).text());
        },
    }

    init = function(){

        fun.postBtnEvent();
        fun.resetBtnEvent();
        fun.addTag();
        fun.deleteTag();

        // $("iframe").contents().find("body").on('keyup',function(){
        //  fun.getRawContentLength()
        // });
        
    };

    return {
        init:init
    };
    
});